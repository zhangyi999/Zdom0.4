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

// 
// index
//     // storageHooks = () => {...}
//     useData // hooksList.push
//     useData // hooksList.push
//     Children
//         // storageHooks()
//         // storageHooks = () => {...}
//         useData
//         Children2
//         useData
//     Children
//         useData
//         最后一次收集

// 全局 hooks
let hooks = []
// 全局搬运工，负责收集并执行 hook 和 Components 之间的关系
let hooksList = []
let storageHooks;

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
        console.log(fun)
        console.log(this.data,fun)
    }

    function watch(obj) {
        console.log(obj)
    }

    function computer(fun) {
        console.log(this.data,fun)
    }

    function die(fun) {
        console.log(fun)
        console.log(this.data,fun)
    }
    
    hooksList.push({
        data: obsData.data,
        loaded,
        watch,
        computer,
        die
    })

    return obsData
}

function dom( attr, ...child ) {
    // return {
    //     attr,
    //     children: child
    // }
    // const obj = {}
    // for(var k in attr) {
    //     if ( attr[k] instanceof Function ) {
    //         obj[k] = attr[k]()
    //     } else {
    //         obj[k] = attr[k]
    //     }
    // }
    return {
        attr,
        children: child
    }
}

function Children1() {
    const $ = useState(1)
    return (
        dom({ class:() => {
            return this.data.a + 1 
        } },
            () => this.children
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
        dom({
            class:() => {
                return data.a + 1 
            },
        },
            () => this.children,
            Children({
                a: () => this.a + '33' + $.data
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
        dom({},
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
                () => i == 1 ? Children({a:2}): 'Children'
            ),
            Children({a:2})
        )
    )
}

let Index = Components(index)

let initRender = {}

function main() {
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
    initRender.vnode = Index()
    // 收集最后一次 hooks
    storageHooks()
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