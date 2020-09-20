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
        // log
        l.vnode = vnode
        looks.push(l)
        return vdom
    } 
}

function useState(initData) {
    const obsData = {
        data: initData
    }
    function loaded(fun) {
        console.log(this,fun)
    }

    function watch(obj) {
        console.log(obj)
    }

    function computer(fun) {
        console.log(this,fun)
    }

    function die(fun) {
        console.log(fun)
        console.log(this.data,fun)
    }
    const state = {
        data: obsData.data,
        loaded,
        watch,
        computer,
        die,
        vnod: vnodes
    }
    addDefine( obsData, 'setState' , () => {
        return n => {
            obsData.data = n
            const vnode = state.vnod()
            const {sVnode, attr, children} = vnode
            const sAttr = sVnode.attr
            const sChildren = sVnode.children
            for (const k in attr ) {
                if ( attr[k] instanceof Function ) {
                    const newAttr = attr[k]()
                    if ( newAttr !== sAttr[k] ) {
                        setAttribute(sVnode.Dom, k, newAttr)
                        sAttr[k] = newAttr
                    }
                }
            }
            const oldChildrens =[...sVnode.Dom.childNodes]
            children.map( (v, i) => {
                if ( v instanceof Function ) {
                    const newChildren = v()
                    const oldChildren = sChildren[i]
                    console.log({newChildren, oldChildren})
                    if ( checkTypes(newChildren) !== checkTypes(oldChildren) ) {
                        if ( newChildren instanceof Array ) {
                            const fragment = document.createDocumentFragment()
                            const vnodes = appCidren(newChildren, fragment)
                            sVnode.Dom.replaceChild( fragment  ,oldChildrens[i])
                            sChildren[i] = vnodes
                            return
                        }

                        // if ( (oldChildren instanceof Array) ) {
                        //     [...oldChildrens[i]][0]
                        // }


                        const fragment = document.createDocumentFragment()
                        const vnodes = appCidren(newChildren, fragment)
                        sVnode.Dom.replaceChild( fragment  ,oldChildrens[i])
                        sChildren[i] = vnodes
                        return
                    }

                    if ( !(newChildren instanceof Object) ) {
                        const fragment = document.createDocumentFragment()
                        const vnodes = appCidren(newChildren, fragment)
                        sVnode.Dom.replaceChild( fragment  ,oldChildrens[i])
                        sChildren[i] = vnodes
                        return
                    }

                    
                    
                    // console.log(newChildren, newChildren, sChildren[i] , newChildren === sChildren[i])
                    // if ( newAttr !== sAttr[k] ) {
                    //     console.log ([sVnode.Dom], k, newAttr)
                    //     setAttribute(sVnode.Dom, k, newAttr)
                    //     sAttr[k] = newAttr
                    // }
                }
            })
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
        if(/@\S/.test(key)) {
            const value = attr[key]()
            sVnode[key] = value
            const events = key.replace('@','')
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
            return;
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
        $.setState(12)
        // setTimeout(()=>{
        //     i = 999
        //     $.setState(12)
        // }, 1000)
    }, 1000)
    return (
        dom('div',{ class:() => $.data + this.data.a + 1 },
            () => $.data,
            'Children',
            () => $.data === 1 ? '--h1--': dom('h1',{},'---'),
            () => [1,3,4,5,1,2,3].map( v => dom('p',{}, () => v))
        )
    )
}

let Children = Components(Children1)
// let i1 = 999
function Children2( ) {
    const $ = useState(2)
    const data = this.data

    const $1 = useState('$1')
    return (
        dom('h2',{
            class:() => {
                return data.a + 1 
            },
        },
            () => data.a  + 'C000',
            Children({
                a: () => this.data.a + '33' + $.data
            })
        )
    )
}

let Children_2 = Components(Children2)


let i = 1
function index() {
    // const [i,set] = useState(0)
    // setTimeout(() => {
    //     set(i+1)
    // },5000)
    return (
        dom('h1',{},
            Children_2({
                a: () => {
                    return i
                }
            },
                'A',
                () => i + 'children'
            ),
            Children({a:1},
                'Children',
                () => i == 1 ? Children({a:2}): '1'
            ),
            Children({a:2})
        )
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
    initRender.vnode = Index()
    const fragment = document.createDocumentFragment()
    initVnode( initRender.vnode , fragment )
    root.appendChild(fragment)
    // 收集最后一次 hooks
    storageHooks()
    vnodes = null
    return $
}
main()
console.log(looks)

// function setData(n) {
//     const obj = {data:n}
//     let i = null
//     obj.set = n => {
//         clearTimeout(i)
//         i = setTimeout(()=>{
//             console.log(n, obj)
//             obj.data = n
//             clearTimeout(i)
//         },0)
//     }
//     return obj
// }

// function obsData(initData) {
//     const obj = {data:initData}
//     let i = null
//     obj.setData = n => {
//         mergeData(n)
//         clearTimeout(i)
//         i = setTimeout(()=>{
//             reload()
//             clearTimeout(i)
//         },0)
//     }
//     return obj
// }
// function dom( type, attr, ...child ) {
//     console.log(type)
//     // return {
//     //     attr,
//     //     children: child
//     // }
//     // const obj = {}
//     // for(var k in attr) {
//     //     if ( attr[k] instanceof Function ) {
//     //         obj[k] = attr[k]()
//     //     } else {
//     //         obj[k] = attr[k]
//     //     }
//     // }
//     return {
//         attr,
//         children: child
//     }
// }
// dom('div',{
//     class: () => 1 + 1
// },
//     dom('h2', {
        
//     },
//         'A',
//         dom('Components', {})
//     )
// )