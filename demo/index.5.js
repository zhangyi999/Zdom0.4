
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


let hooks = []
let reload;
function Components( com ) {
    let chook;
    return ( attrs, ...child ) => {
        console.log(chook,'chookchook', com)
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
        attr.children = children
        reload = () => com(attr)
        const vdom = com(attr)
        // chook = hooks
        // prhooks.pre = hooks
        // hooks = prhooks
        // hooks = []

        console.log(chook,'attr', com)
        return vdom
    } 
}

let data
function useState(init) {
    if ( !data ) data = init
    const render = reload
    function set(n) {
        data = n
        const r = render()
        console.log(r)
    }
    reload = null
    hooks.push({init, set})
    return [data, set]
}

function dom( attr, ...child ) {
    // return {
    //     attr,
    //     children: child
    // }
    const obj = {}
    for(var k in attr) {
        if ( attr[k] instanceof Function ) {
            obj[k] = attr[k]()
        } else {
            obj[k] = attr[k]
        }
    }
    return {
        attr,
        children: child
    }
}

function Children1({a, children}) {
    const [i1,set] = useState(1)
    return (
        dom({ class:() => {
            return a + 1 
        } },
            () => children
        )
    )
}

let Children = Components(Children1)
// let i1 = 999
function Children2({a, children}) {
    const [i1,set] = useState(2)
    return (
        dom({
            class:() => {
                return a + 1 
            },
        },
            () => children,
            Children({
                a: () => a + '33' + i1
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
            Children({a:1}),
            Children({a:2})
        )
    )
}

let Index = Components(index)

k = Index()
