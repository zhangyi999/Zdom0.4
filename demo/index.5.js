function checkTypes( data ) {
    return Object.prototype.toString.call(data).replace(/object|\[|\]| /g,'')
}
// 状态保存
function addDefine( obj, key , call ) {
    Object.defineProperty(obj, key, {
        enumerable: false, // 可枚举
        configurable: true, // fales 不能再define
        get() {
            return call()
        }
    });
}

// 全局 hooks
let hooks = []

// 全局搬运工，负责收集并执行 hook 和 Components 之间的关系
let hooksList = []
let storageHooks;
// 储存 vnode
let vnodes = null;

// 测试用
let looks = []

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
        const l = {}
        storageHooks = () => {
            hooks = hooksList
            l.hooks = hooks
            hooksList = []
            // 清除 storageHooks
            storageHooks = null
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
        // // log
        // l.vnode = vnode
        // looks.push(l)
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
    console.log(vnode)
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

function insertAfter(newElement,targetElement) {
    var parent = targetElement.parentNode;
    if (parent.lastChild == targetElement) {
        parent.appendChild(newElement);
    } else {
        parent.insertBefore(newElement,targetElement.nextsibling);
    }
}

function diffVnode( newVnode, oldVnode ) {
    // if ( newVnode )
    if ( !(newVnode instanceof Object ) && !(oldVnode instanceof Object ) && newVnode != oldVnode ){
        const fragment = document.createDocumentFragment()
        const vnodes = appCidren(newChildrenVnode, fragment)
        sVnode.Dom.replaceChild( fragment  ,oldChildrenDom[i])
        sChildren[i] = vnodes
    }
}

function useState(initData) {
    const obsData = {
        data: initData
    }
    function loaded(fun) {
        console.log(this,'loaded')
    }

    function watch(obj) {
        console.log(obj)
    }

    function computer(fun) {
        console.log(this,fun)
    }

    function die(fun) {
        // console.log(fun)
        console.log(this.data, 'die');
    }
    const state = {
        data: obsData.data,
        loaded,
        watch,
        computer,
        die,
        vnod: vnodes
    }
    // 合并 setState 后在渲染
    let time = null
    addDefine( obsData, 'setState' , () => {
        return n => {
            obsData.data = n
            clearTimeout(time)
            time = setTimeout(()=>{
                const vnode = state.vnod()
                const {sVnode, attr, children} = vnode
                const sAttr = sVnode.attr
                const sChildren = sVnode.children
                for (const k in attr ) {
                    if ( !(/on\S/.test(key)) && attr[k] instanceof Function ) {
                        const newAttr = attr[k]()
                        if ( newAttr !== sAttr[k] ) {
                            newAttr?setAttribute(sVnode.Dom, k, newAttr): sVnode.Dom.removeAttribute(k)
                            sAttr[k] = newAttr
                        }
                    }
                }
                let oldChildrenDom = [...sVnode.Dom.childNodes]
                let newArrayEmptyNumber = 0
                let newArrayLength = 0
                children.map( (v, i1) => {
                    
                    if ( v instanceof Function ) {
                        const newChildrenVnode = v()
                        const oldChildrenVnode = sChildren[i1]
                        
                        // 0.1 粗糙版本，只对比同级 newChildrenVnode is Array 截止
                        
                        if ( newChildrenVnode instanceof Array ) {
                            newArrayLength = newArrayLength + newChildrenVnode.length - 2
                            if ( oldChildrenVnode instanceof Array ) {
                                let oldlen = oldChildrenVnode.length
                                if ( newChildrenVnode.length === 0 ) newArrayEmptyNumber += 1
                                const maxLen = Math.max(newChildrenVnode.length, oldChildrenVnode.length)
                                let fragment = document.createDocumentFragment()
                                for ( let i = 0; i < maxLen; i++ ) {
                                    // console.log(oldChildrenDom, i1, i, [oldChildrenDom[i1+i - 1]]);
                                    // 新的数组短
                                    if ( newChildrenVnode[i] === undefined ) {
                                        // console.log('undefined',sVnode.Dom.childNodes, oldChildrenDom, i1, i, oldChildrenVnode, newArrayEmptyNumber);
                                        // oldChildrenDom[i1+i].remove()
                                        sVnode.Dom.childNodes[i1].remove()
                                        doneDie('die', oldChildrenVnode[i])
                                        oldChildrenVnode.length -= 1;
                                        oldChildrenDom.splice(i1,1);
                                    } else if ( oldChildrenVnode[i] === undefined ) {
                                        // 旧的数组短
                                        // console.log( newChildrenVnode, oldChildrenVnode, oldChildrenDom, i1,i )
                                        // 旧的数组短
                                         const vnodes = appCidren(newChildrenVnode[i], fragment);
                                         sChildren[i1].push(vnodes);
                                        //  console.log({sChildren: sChildren[i1],i1})

                                    } else if ( 
                                        !(oldChildrenVnode[i] instanceof Object ) && 
                                        !(newChildrenVnode[i] instanceof Object ) && 
                                        newChildrenVnode[i] != oldChildrenVnode[i]
                                    ) {
                                        // console.log('非节点')
                                        // 非节点
                                        let fragment = document.createDocumentFragment()
                                        const vnodes = appCidren(newChildrenVnode, fragment)
                                        sChildren[i] = vnodes
                                        sVnode.Dom.replaceChild( fragment, oldChildrenDom[i] )
                                        fragment = null

                                    } else if ( newChildrenVnode[i].$$type !== oldChildrenVnode[i].$$type ) {
                                        // 类型不同
                                        // console.log('类型不同')
                                        let fragment = document.createDocumentFragment()
                                        const vnodes = appCidren(newChildrenVnode, fragment)
                                        sChildren[i] = vnodes
                                        sVnode.Dom.replaceChild( fragment, oldChildrenDom[i] )
                                        fragment = null
                                    } else {
                                        // 节点类型相同
                                        const { attr, children } = newChildrenVnode[i]
                                        const sVnode = oldChildrenVnode[i]
                                        const sAttr = sVnode.attr
                                        const sChildren = sVnode.children
                                        for (const k in attr ) {
                                            if (!(/on\S/.test(k)) && attr[k] instanceof Function ) {
                                                const newAttr = attr[k]()
                                                if ( newAttr !== sAttr[k] ) {
                                                    newAttr?setAttribute(sVnode.Dom, k, newAttr): sVnode.Dom.removeAttribute(k)
                                                    sAttr[k] = newAttr
                                                }
                                            }
                                        }
                                        children.map( v => {
                                            // diff children
                                        })
                                    }
                                }
                                console.log({oldlen, i1, newArrayEmptyNumber, oldChildrenDom}, i1 - newArrayEmptyNumber + oldlen + newArrayLength, newArrayLength,oldChildrenDom)
                                if ( oldlen < newChildrenVnode.length ) {
                                    oldChildrenDom[i1 - newArrayEmptyNumber + oldlen]?
                                        sVnode.Dom.insertBefore(fragment,oldChildrenDom[i1- newArrayEmptyNumber + (oldlen - 1) + newArrayLength - 2]):
                                        sVnode.Dom.appendChild(fragment);
                                }
                                fragment = null
                            } else {
                                
                                let fragment = document.createDocumentFragment()
                                const vnodes = appCidren(newChildrenVnode, fragment)
                                sChildren[i1] = vnodes
                                sVnode.Dom.replaceChild( fragment, oldChildrenDom[i1] )
                                fragment = null
                            }
                        } else {
                            if ( oldChildrenVnode instanceof Array ) {
                                let fragment = document.createDocumentFragment()
                                const vnodes = appCidren(newChildrenVnode, fragment)
                                sChildren[i1] = vnodes
                                sVnode.Dom.replaceChild( fragment, oldChildrenDom[0] )
                                oldChildrenVnode.map( (v, i) => {
                                    if ( i > 0 ) {
                                        oldChildrenDom[i].remove()
                                    }
                                })
                                fragment = null
                            } else {
                                let fragment = document.createDocumentFragment();
                                const vnodes = appCidren(newChildrenVnode, fragment);
                                console.log(i1 ,newArrayEmptyNumber, newArrayLength, [sVnode.Dom],[fragment],[oldChildrenDom[i1-newArrayEmptyNumber+  Math.max( newArrayLength, 0)]],{ vnodes }, { newChildrenVnode }, oldChildrenDom[i1], i1, oldChildrenDom, newArrayEmptyNumber);
                                sChildren[i1] = vnodes;
                                sVnode.Dom.replaceChild(fragment, oldChildrenDom[ Math.max( i1- newArrayEmptyNumber + newArrayLength, 0)]);
                                fragment = null
                            }
                        }
                    }
                })
                oldChildrenDom = null
                clearTimeout(time)
            },0)
            
            // console.log(state.vnod())
            
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
    if ( Vchild.$$type ) {
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
    doneDie('loaded', vnode)
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

// ----------- Test
function Children1() {
    const $ = useState(1)
    setTimeout(()=>{
        i = 999
        // $.setState(12)
        $.setState(13)
        setTimeout(()=>{
            i = 999
            $.setState(1)
            setTimeout(()=>{
                i = 999
                // $.setState(12)
                $.setState(13)
                setTimeout(()=>{
                    i = 999
                    $.setState(1)
                }, 1000)
            }, 1000)
        }, 1000)
    }, 1000)
    return (
        <div class={$.data + this.data.a + 1}>
            {$.data}
            Children
            {$.data === 1 ? '--h1--': <h1>---</h1>}
        </div>
    )
}

let Children = Components(Children1)
// let i1 = 999
function Children2( ) {
    const $ = useState(2)
    const data = this.data

    const $1 = useState('$1')
    return (
        <h2>
            {data.a  + 'C000'},
            <Children a={this.data.a + '33' + $.data}/>
        </h2>
    )
}

let Children_2 = Components(Children2)


let i = 1
function index() {
    const $ = useState(2)
    const inp = useState(2)
    // setTimeout(() => {
    //     i = 999;
    //     // $.setState(12)
    //     $.setState('A');
    //     setTimeout(() => {
    //         i = 999;
    //         $.setState('C');
    //         setTimeout(() => {
    //             i = 999;
    //             // $.setState(12)
    //             $.setState('B');
    //             setTimeout(() => {
    //                 i = 999;
    //                 $.setState('A');
    //             }, 1000);
    //         }, 1000);
    //     }, 1000);
    // }, 1000);
    // const [i,set] = useState(0)
    // setTimeout(() => {
    //     set(i+1)
    // },5000)
    // <Children_2 a={i}>A {i + 'children'}</Children_2>
    // <Children a={1}>Children {i == 1 ? <Children a={2} />: '1'}</Children>
    // <Children a={3} />
    let oo = [0]

    // {oo.map( v => <p>{v}</p>)}
    return (
        <h2>
            {oo.map( v => <p>{v}</p>)}
            {oo.map( v => <p>{v}</p>)}
            {oo.map( v => <p>{v}</p>)}
            {inp.data}
            {inp.data}
            <input type='text' value={inp.data} onInput={(el) => {
                console.log(el.value)
                
                if ( el.value === '' ) {
                    oo = []
                } else oo.push(el.value)
                inp.setState(el.value)
            }} />
        </h2>
        
    )
}

let Index = Components(index)

let initRender = {}

function main() {
    vnodes = () => initRender.vnode
    storageHooks = () => {
        hooks = [...hooksList]
        hooksList = []
        initRender.hooks = hooks
        // l.vnode = wind.vnode
        // addDefine( l, 'vnode' , () => initRender.vnode ) 
        looks.push(initRender)
        // 清除 storageHooks
        storageHooks = null
    }
    
    let $ = useState('!')
    root.innerHTML = ''
    initRender.vnode = <Index />
    const fragment = document.createDocumentFragment()
    initVnode( initRender.vnode , root )
    root.appendChild(fragment)
    // 收集最后一次 hooks
    storageHooks()
    vnodes = null
    return $
}
main()
console.log(looks)
