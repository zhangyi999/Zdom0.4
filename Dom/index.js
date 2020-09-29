// 状态保存
function addDefine( obj, key , call ) {
    Object.defineProperty(obj, key, {
        // enumerable: false, // 可枚举
        // configurable: false, // fales 不能再define
        get() {
            return call()
        }
    });
}

function flat(arr, fn = () => {}){
	if(Object.prototype.toString.call(arr) != "[object Array]"){return false};
    let res=[];
    let i = 0
    arr.map(item=>{
        if(item instanceof Array){
            res.push(...flat(item, v => {
                fn(v, i)
                i += 1
            }));
        }else{
            fn(item, i)
            i += 1
            res.push(item)
        }
    });
    return res;
};

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
                // attr[k] = attrs[k]()
            } else {
                attr[k] = attrs[k]
            }
        }
        for(var k in child) {
            // flat(arr)
            if ( child[k] instanceof Function ) {
                addDefine( children, k , child[k])
                // children[k] = child[k]()
            } else {
                children[k] = child[k]
            }
        }
        // 开始渲染
        const vdom = com.call({props:attr, children})
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
    if ( !vnode ) return
    if ( vnode instanceof Function ) {
        return doneDie(type, vnode())
    }
    if ( vnode instanceof Array ) {
        vnode.map(v => doneDie(type, v))
        return
    }
    if ( !type || !vnode.$$type ) return
    if ( vnode.hooks ) {
        vnode.hooks().map( v => {
            type==='die'?v.die():v.loaded()
        })
        vnode.children.map( v => {
            doneDie(type, v)
        })
    }
    
    
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
    console.log({sVnode, vnode})
    // 每遍历【过】一个 非数组 非空 元素就 +1 ，svnode 指针
    let previousElementIndex = 0
    // const maxLen = Math.max(children.length, sChildren.length)
    // console.log(maxLen, children, sChildren,'sChildrensChildren')
    // 遍历 newChild

    function diffReplaceVnode( vnode ) {
        console.log( vnode, '遍历 new')
        let newChildrenVnode = vnode
        let oldChildrenVnode = sChildren[previousElementIndex]
        if (
            !(oldChildrenVnode instanceof Object ) && 
            !(vnode instanceof Object )
         ) {
            if ( vnode === oldChildrenVnode ){
                (   newChildrenVnode
                    || newChildrenVnode === 0
                    || newChildrenVnode === ''
                ) ? previousElementIndex += 1: null
            } else {
                console.log('替换文本')
                sChildren[previousElementIndex] = newChildrenVnode;
                Dom.childNodes[previousElementIndex].textContent = newChildrenVnode
                // 比 replaceChild 快五倍
                previousElementIndex += 1
            }
        } else if ( newChildrenVnode === undefined || newChildrenVnode === null  ) {
            console.log(newChildrenVnode, previousElementIndex , '删除 --old')
            sChildren[previousElementIndex].sVnode.Dom.remove()
            doneDie('die', sChildren[previousElementIndex])
            // previousElementIndex += 1
            // continue
        } else if ( oldChildrenVnode === undefined || oldChildrenVnode === null  ) {
            console.log(newChildrenVnode, previousElementIndex , '增加 old')
            let fragment = document.createDocumentFragment()
            const vnodes = appCidren(vnode, fragment);
            sChildren[previousElementIndex] = (vnodes);
            // insertAfter(fragment,Dom.childNodes[previousElementIndex-1])
            const traget = Dom.childNodes[previousElementIndex]
            // console.log(traget, Dom, ,'tragettraget')
            traget?Dom.insertBefore(fragment,traget):Dom.appendChild(fragment);
            fragment = null
            previousElementIndex += 1

        } else if ((newChildrenVnode.$$type !== oldChildrenVnode.$$type) ) { 
            // 类型不同
            let fragment = document.createDocumentFragment()
            const vnodes = appCidren(newChildrenVnode, fragment)
            Dom.replaceChild( fragment, Dom.childNodes[previousElementIndex] )
            doneDie('die', oldChildrenVnode)
            sChildren[previousElementIndex] = vnodes
            fragment = null
            previousElementIndex += 1
        } else {
            diffVnode( newChildrenVnode, oldChildrenVnode.sVnode )
            previousElementIndex += 1
        }
        //     previousElementIndex += 1
        // }

        console.log(vnode,sChildren[previousElementIndex],'vnode')

        // previousElementIndex += 1
    }
    for( let i1 = 0; i1 < children.length; i1 ++ ) {
        // console.log('12321', [children[i1]], i1,'12321')
        let newChildrenVnode = children[i1]
        if ( newChildrenVnode instanceof Function ) {
            newChildrenVnode = newChildrenVnode()
            // console.log(newChildrenVnode,sChildren, previousElementIndex ,'previousElementIndexpreviousElementIndexpreviousElementIndex')
            if ( (newChildrenVnode === undefined || newChildrenVnode === null) ) {
                if ( !(sChildren[previousElementIndex]) ) continue
                console.log(newChildrenVnode, sChildren[previousElementIndex] , '删除 1old')
                sChildren[previousElementIndex].sVnode.Dom.remove()
                doneDie('die', sChildren[previousElementIndex])
                sChildren.splice(previousElementIndex,1)
                // previousElementIndex += 1
                
            } else if ( newChildrenVnode instanceof Array ) {
                // 铺平 newChild
                if ( newChildrenVnode.length === 0 && sChildren[previousElementIndex] ) {
                    // 0数组不执行

                    sChildren[previousElementIndex].sVnode.Dom.remove()
                    doneDie('die', sChildren[previousElementIndex])
                    sChildren.splice(previousElementIndex,1)
                    console.log(
                        newChildrenVnode,
                        {previousElementIndex},
                        sChildren,
                        vnode
                        , '空数组 不执行 flat')
                    // diffReplaceVnode( undefined )
                } else {
                    flat(newChildrenVnode, diffReplaceVnode);
                }
            } else {
                // console.log('非数组', newChildrenVnode, sChildren[previousElementIndex])
                diffReplaceVnode(newChildrenVnode)
            }
        } else {
            console.log({a:children[i1].$$type}, {sChildren:sChildren[previousElementIndex]} , i1, {previousElementIndex}, '非函数情况')

            if ( children[i1].$$type ) {
                if ( children[i1].$$type === sChildren[previousElementIndex].$$type ) {
                    diffVnode( newChildrenVnode, sChildren[previousElementIndex].sVnode )
                    previousElementIndex += 1
                } else {
                    diffReplaceVnode( newChildrenVnode )
                }
                
            } else {
                previousElementIndex += 1
            }
            // previousElementIndex += 1
        }
    }
    // // 遍历剩余的 oldChild
    for ( let i1 = previousElementIndex; i1 < sChildren.length; i1++ ) {
        console.log(sChildren,sChildren[i1] , '1111删除 old')
        sChildren[i1].sVnode.Dom.remove()
        doneDie('die', sChildren[i1])
    }
    sChildren.length = previousElementIndex
    previousElementIndex = null
}

function useState(initData) {
    const obsData = {
        state: initData,
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
        loadedMap.map( v => v(obsData.state))
    }

    function computer() {
        computerMap.map( v => v(obsData.state))
    }

    function die() {
        dieMap.map( v => v(obsData.state))
    }
    const state = {
        data: obsData.state,
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
                obsData.state = fn(obsData.state):
                obsData.state = fn
            clearTimeout(time)
            time = setTimeout(()=>{
                computer()
                const vnode = state.vnod()
                const {sVnode} = vnode
                diffVnode( vnode, sVnode )
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

    if ( Vchild && Vchild.$$type ) {
        initVnode( Vchild , parent )
        return Vchild
    }

    // if ( !(Vchild instanceof Object) ) {
    //     parent.appendChild(document.createTextNode(Vchild!==null?Vchild:''))
    //     return Vchild
    // }
    if ( Vchild instanceof Array ) {
        // Vchild = flat(Vchild)
        const vns = []
        const clen = Vchild.length
        // console.time(2)
        for(let i = 0; i< clen; i++) {
            const vnode = appCidren(Vchild[i], parent)
            vns.push(vnode)
        }
        // console.timeEnd(2)
        return vns
    }
    if ( Vchild instanceof Function ) {
        const vnode = appCidren(Vchild(), parent)
        return vnode 
    }
    // if ( Vchild instanceof Element || Vchild instanceof Text || Vchild instanceof DocumentFragment ) {
    //     parent.appendChild(Vchild)
    //     return Vchild
    // }
    parent.appendChild(document.createTextNode(Vchild!==null?Vchild:''))
    return Vchild
}

function initVnode( vnode , parent ) {
    // 第一次执行的时候，收集最后一次 hooks
    // 每次数据更新创建元素的时候，vnode 拼接好以后
    storageHooks()
    // vnode.children = flat(vnode.children)
    // console.log(vnode.children,'vnode.childrenvnode.children')
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
    const clen = children.length
    const vlist = []
    for(let i = 0; i< clen; i++) {
        const vnode = appCidren(children[i], Dom)
        vlist.push(vnode)
        // sVnode.children.push(vnode)
    }
    // 铺平 sVnode.children
    sVnode.children= flat(vlist)

    parent.appendChild(Dom)
    sVnode.Dom = Dom
    vnode.sVnode = sVnode
    doneDie('loaded', vnode)
}

function dom( $$type ,attr, ...child ) {
    return {
        $$type,
        attr,
        children: child
    }
}


function render(fun, APP) {
    let initRender = {}
    vnodes = () => initRender.vnode
    storageHooks = () => {
        hooks = [...hooksList]
        hooksList = []
        initRender.hooks = hooks
        // 清除 storageHooks
        storageHooks = () => {}
    }
    APP.innerHTML = ''
    initRender.vnode = fun()
    const fragment = document.createDocumentFragment()
    initVnode( initRender.vnode , fragment )
    APP.appendChild(fragment)
    vnodes = null
}

export {
    useState,
    render,
    Components
}
export default dom