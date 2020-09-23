// 状态保存
function addDefine( obj, key , call ) {
    Object.defineProperty(obj, key, {
        enumerable: false, // 可枚举
        configurable: false, // fales 不能再define
        get() {
            return call()
        }
    });
}

// 全局 hooks
let hooks = []

// 全局搬运工，负责收集并执行 hook 和 Components 之间的关系
let hooksList = []
let storageHooks = () => {};
// 储存 vnode
let vnodes = null;

// 测试用
// let looks = []

function Components( com ) {
    // 初始化
    let chook;
    return ( attrs, ...child ) => {
        // 打印执行顺序
        // console.log(com)
        // 通知上一个组件储存 hooks
        storageHooks()
        // 初始化全局组件 hooks
        let hooks = []
        let vnode;

        vnodes = () => vnode
        storageHooks = () => {
            hooks = hooksList
            // console.log(hooks[0].loaded(),'vnod1111e===')
            hooksList = []
            // 清除 storageHooks
            storageHooks = () => {}
        }
        // 处理组件参数，包装 () => {} 参数类型
        const attr = {}
        const children = []
        for(var k in attrs) {
            if ( attrs[k] instanceof Function ) {
                addDefine( attr, k , attrs[k] )
            } else {
                attr[k] = attrs[k]
            }
        }
        for(var k in child) {
            if ( child[k] instanceof Function ) {
                addDefine( children, k , child[k] )
            } else {
                children[k] = child[k]
            }
        }
        // 开始渲染
        const vdom = com.call({data:attr, children})
        vnode = vdom
        vdom.hooks = () => hooks
        return vdom
    } 
}

// 执行 die 函数
// vnode: {
//     $$type: String,
//     attr: Object,
//     children: Array,
//     hooks: Array[{
//         useState
//     }],
//     sVnode: {
//         Dom: element,
//         attr,
//         children
//     }
// }
// type : loaded|die
function doneDie(type, vnode = {}) {
    if ( !type || !vnode.$$type ) return
    // console.log(type, vnode.hooks())
    // console.log(vnode)
    if ( vnode.hooks ) {
        vnode.hooks().map( v => {
            type==='die'?v.die():v.loaded()
        })
    }

    vnode.children.map( v => {
        if ( v.$$type ) {
            doneDie(type, v)
            return
        }

        if ( v instanceof Array ) {
            v.map(v => doneDie(type, v))
            return
        }
    })
}

// diff 虚拟 dom

// function insertAfter(newElement,targetElement) {
//     var parent = targetElement.parentNode;
//     if (parent.lastChild == targetElement) {
//         parent.appendChild(newElement);
//     } else {
//         parent.insertBefore(newElement,targetElement.nextsibling);
//     }
// }

// 1. 输入 vnode & sVnode
// 2. vnode 获取新数据
// 3. sVnode 获取 parentDmo
// 4. 对比 attr ，change attr
// 5. 对比 children，遍历
// 6. 类型不同直接替换，执行 sVnode.hooks
// 7. 值不同直接替换，执行 sVnode.hooks
// 8. 同是数组，轮询递归，vnode & sVnode

function diffVnode( vnode, sVnode ) {
    // console.log( vnode.children[0] instanceof Function?vnode.children[0]():'', sVnode,'vnode, sVnode' )
    const {attr, children} = vnode
    const Dom = sVnode.Dom
    const sAttr = sVnode.attr
    const sChildren = sVnode.children
    for (const k in attr ) {
        if ( !(/on\S/.test(k)) && attr[k] instanceof Function ) {
            const newAttr = attr[k]()
            if ( newAttr !== sAttr[k] ) {
                newAttr?setAttribute(Dom, k, newAttr): Dom.removeAttribute(k)
                sAttr[k] = newAttr
            }
        }
    }
    // console.log({sVnode, vnode, Dom})
    // 每遍历【过】一个 非数组 非空 元素就 +1 ，
    let previousElementIndex = 0
    // console.log(children)
    children.map((v, i1) => {
        if ( v instanceof Function ) {
            const newChildrenVnode = v()
            const oldChildrenVnode = sChildren[i1]

            // console.log({newChildrenVnode, oldChildrenVnode}, 'v()')
            // 0.1 粗糙版本，只替换 不 位移
            
            if ( newChildrenVnode instanceof Array ) {
                if ( oldChildrenVnode instanceof Array ) {
                    const maxLen = Math.max(newChildrenVnode.length, oldChildrenVnode.length)
                    // let fragment = document.createDocumentFragment()
                    for ( let i = 0; i < maxLen; i++ ) {
                        // 新的数组短
                        // remove
                        if ( newChildrenVnode[i] === undefined ) {
                            // console.log('undefined',sVnode.Dom.childNodes, oldChildrenDom, i1, i, oldChildrenVnode, newArrayEmptyNumber);
                            // oldChildrenDom[i1+i].remove()
                            Dom.childNodes[previousElementIndex].remove()
                            doneDie('die', oldChildrenVnode[i])
                            oldChildrenVnode.length -= 1
                        } else if ( oldChildrenVnode[i] === undefined ) {
                            // add
                            // 旧的数组短
                            // console.log({previousElementIndex_1:previousElementIndex-1}, 'addaddadd')
                            let fragment = document.createDocumentFragment()
                            const vnodes = appCidren(newChildrenVnode[i], fragment);
                            sChildren[i1].push(vnodes);
                            // insertAfter(fragment,Dom.childNodes[previousElementIndex-1])
                            const traget = Dom.childNodes[previousElementIndex]
                            // console.log(traget, Dom, ,'tragettraget')
                            traget?Dom.insertBefore(fragment,traget):Dom.appendChild(fragment);
                            fragment = null
                            previousElementIndex += 1
                            // console.log({sChildren: sChildren[i1],i1})

                        } else if ( 
                            !(oldChildrenVnode[i] instanceof Object ) && 
                            !(newChildrenVnode[i] instanceof Object ) && 
                            newChildrenVnode[i] !== oldChildrenVnode[i]
                        ) {
                            // console.log('非节点')
                            // 非节点| replace
                            let fragment = document.createDocumentFragment()
                            const vnodes = appCidren(newChildrenVnode, fragment)
                            sChildren[i] = vnodes
                            Dom.replaceChild( fragment, Dom.childNodes[previousElementIndex] )
                            fragment = null
                            previousElementIndex += 1

                        } else if ( newChildrenVnode[i].$$type !== oldChildrenVnode[i].$$type ) {
                            // 类型不同
                            // console.log('类型不同')
                            let fragment = document.createDocumentFragment()
                            const vnodes = appCidren(newChildrenVnode, fragment)
                            sChildren[i] = vnodes
                            Dom.replaceChild( fragment, Dom.childNodes[previousElementIndex] )
                            fragment = null
                            previousElementIndex += 1
                        } else {
                            // 节点类型相同
                            // console.log(newChildrenVnode[i], oldChildrenVnode[i].sVnode,'节点类型相同节点类型相同节点类型相同节点类型相同' )
                            diffVnode( newChildrenVnode[i], oldChildrenVnode[i].sVnode )
                            previousElementIndex += 1
                        }
                    }
                } else {
                    let fragment = document.createDocumentFragment()
                    const vnodes = appCidren(newChildrenVnode, fragment)
                    sChildren[i1] = vnodes
                    Dom.replaceChild( fragment, Dom.childNodes[previousElementIndex] )
                    fragment = null
                    previousElementIndex += newChildrenVnode.length
                }
            } else {
                if ( oldChildrenVnode instanceof Array ) {
                    let fragment = document.createDocumentFragment()
                    const vnodes = appCidren(newChildrenVnode, fragment)
                    Dom.replaceChild( fragment, Dom.childNodes[previousElementIndex] )
                    previousElementIndex += 1
                    oldChildrenVnode.map( (v, i) => {
                        if ( i > 0 ) {
                            Dom.childNodes[previousElementIndex].remove()
                            doneDie('die', v)
                        }
                    })
                    sChildren[i1] = vnodes
                    fragment = null
                } else {
                    // console.log( {newChildrenVnode, oldChildrenVnode},'vnod11e, sVno111de' )
                    if ( 
                        !(oldChildrenVnode instanceof Object ) && 
                        !(newChildrenVnode instanceof Object )
                    ) {
                        if ( newChildrenVnode === oldChildrenVnode ){
                            (   newChildrenVnode
                                || newChildrenVnode === 0
                                || newChildrenVnode === ''
                            ) ? previousElementIndex += 1: null
                            return
                        } 
                        let fragment = document.createDocumentFragment();
                        const vnodes = appCidren(newChildrenVnode, fragment);
                        //console.log(i1 ,newArrayEmptyNumber, newArrayLength, [sVnode.Dom],[fragment],[oldChildrenDom[i1-newArrayEmptyNumber+  Math.max( newArrayLength, 0)]],{ vnodes }, { newChildrenVnode }, oldChildrenDom[i1], i1, oldChildrenDom, newArrayEmptyNumber);
                        sChildren[i1] = vnodes;
                        // console.log({Dom},{previousElementIndex})
                        Dom.replaceChild(fragment, Dom.childNodes[previousElementIndex]);
                        fragment = null
                        previousElementIndex += 1
                    } else if((!newChildrenVnode)) {
                        Dom.childNodes[previousElementIndex].remove()
                        doneDie('die', oldChildrenVnode)
                        sChildren[i1] = newChildrenVnode;
                    } else if (!oldChildrenVnode) {
                        let fragment = document.createDocumentFragment()
                        // 这里 newChildrenVnode 已经 被执行 了 component 了，但是最后一个组件 没执行storageHooks()
                        const vnodes = appCidren(newChildrenVnode, fragment);
                        sChildren[i1] = (vnodes);
                        // insertAfter(fragment,Dom.childNodes[previousElementIndex-1])
                        const traget = Dom.childNodes[previousElementIndex]
                        // console.log(traget, Dom, ,'tragettraget')
                        traget?Dom.insertBefore(fragment,traget):Dom.appendChild(fragment);
                        fragment = null
                        previousElementIndex += 1
                    }
                    else if ((newChildrenVnode.$$type !== oldChildrenVnode.$$type) ) {
                        // 类型不同
                        let fragment = document.createDocumentFragment()
                        const vnodes = appCidren(newChildrenVnode, fragment)
                        Dom.replaceChild( fragment, Dom.childNodes[previousElementIndex] )
                        doneDie('die', oldChildrenVnode)
                        sChildren[i1] = vnodes
                        fragment = null
                        previousElementIndex += 1
                    } else {
                        diffVnode( newChildrenVnode, oldChildrenVnode.sVnode )
                    }
                    
                }
            }
        } else {
            // console.log(v, previousElementIndex)
            previousElementIndex += 1
        }
        // previousElementIndex += 1
        // else if ( v ) {
        //     previousElementIndex += 1
        //     // doneDie('loaded', vnode)
        // }
    })
    previousElementIndex = null
}

function useState(initData) {
    const obsData = {
        data: initData,
    }
    const loadedMap = []
    const computerMap = []
    const dieMap = []
    addDefine(obsData, 'loaded', () => fn => {
        loadedMap.push(fn)
        return obsData
    })
    addDefine(obsData, 'computer', () => fn => {
        computerMap.push(fn)
        return obsData
    })
    addDefine(obsData, 'die', () => fn => {
        dieMap.push(fn)
        return obsData
    })
    function loaded() {
        loadedMap.map( v => v(obsData.data))
    }

    function computer() {
        computerMap.map( v => v(obsData.data))
    }

    function die() {
        dieMap.map( v => v(obsData.data))
    }
    const state = {
        data: obsData.data,
        loaded,
        computer,
        die,
        vnod: vnodes
    }
    // 合并 setState 后在渲染
    let time = null
    addDefine( obsData, 'setState' , () => {
        return fn => {
            // 合并这里 后面在写了
            fn instanceof Function ?
                obsData.data = fn(obsData.data):
                obsData.data = fn
            clearTimeout(time)
            time = setTimeout(()=>{
                const vnode = state.vnod()
                const {sVnode} = vnode
                // console.log({vnode, sVnode})
                diffVnode( vnode, sVnode )
                // 保存最后一个组件的 hooks 
                storageHooks()
                computer()
                clearTimeout(time)
            },0)
        }
    })
    hooksList.push(state)

    return obsData
}


// --------------- DOM -------------------
// attr
function setAttribute(dom, key, attrs) {
    if(key === 'placeholder') return dom.placeholder = attrs || '';
    if(key === 'value') return dom.value = attrs || ''
    if(key === 'checked') return dom.checked = attrs == true
    if(key === 'disabled') return dom.disabled = attrs == true
    if(key === '$innerHTML') return dom.innerHTML = attrs
    dom.setAttribute(key, attrs);
}

function appCidren(Vchild, parent) {
    if ( Vchild instanceof Function ) {
        const vnode = appCidren(Vchild(), parent)
        return vnode 
    }

    if ( Vchild instanceof Array ) {
        const fragment = document.createDocumentFragment()
        const vns = []
        Vchild.map( v => {
            // console.log({v})
            const vd = appCidren(v, fragment)
            vns.push(vd)
        })
        parent.appendChild(fragment)
        return vns
    }

    if ( Vchild instanceof Element || Vchild instanceof Text || Vchild instanceof DocumentFragment ) {
        parent.appendChild(Vchild)
        return Vchild
    }
    if ( Vchild && Vchild.$$type ) {
        initVnode( Vchild , parent )
        return Vchild
    }
    parent.appendChild(document.createTextNode(Vchild))
    return Vchild
}

function initVnode( vnode , parent ) {
    const {$$type ,attr, children} = vnode
    const Dom = document.createElement( $$type )
    const sVnode = {
        attr: {},
        children: []
    }
    for(const key in attr) {
        if(/on\S/.test(key)) {
            const value = attr[key]()
            sVnode[key] = value
            const events = key.replace('on','').toLocaleLowerCase()
            if(!events || events === '' || value === '') return;
            Dom.addEventListener(events,function(e){
                e.stopPropagation();
                try{
                    value( this, e );
                }catch(err){
                    console.log(err);
                    throw new Error(events +'方法不存在');
                }
            })
            continue;
        }

        let val;
        if ( attr[key] instanceof Function ) {
            val = attr[key]()
        } else {
            val = attr[key]
        }
        sVnode.attr[key] = val
        setAttribute( Dom, key, val )
    }
    children.map( v => {
        const vnode = appCidren(v, Dom)
        sVnode.children.push(vnode)
    })
    parent.appendChild(Dom)
    sVnode.Dom = Dom
    vnode.sVnode = sVnode
    setTimeout(()=> {
        doneDie('loaded', vnode)
    },10)
}

function dom( $$type ,attr, ...child ) {
    return {
        $$type,
        attr,
        children: child,
        // Dom,
        // render() {
        //     setAttrData.map(v => v())
        //     setChildData.map(v => v())
        // }
    }
}


let initRender = {}

function render(fun, APP) {
    vnodes = () => initRender.vnode
    storageHooks = () => {
        hooks = [...hooksList]
        hooksList = []
        initRender.hooks = hooks
        // l.vnode = wind.vnode
        // addDefine( l, 'vnode' , () => initRender.vnode ) 
        // looks.push(initRender)
        // 清除 storageHooks
        storageHooks = () => {}
    }
    APP.innerHTML = ''
    initRender.vnode = fun()
    const fragment = document.createDocumentFragment()
    initVnode( initRender.vnode , APP )
    APP.appendChild(fragment)
    // 收集最后一次 hooks
    storageHooks()
    vnodes = null
}

export {
    useState,
    render,
    Components
}
export default dom