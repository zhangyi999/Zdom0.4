let states = []
let Ks = []
let randers
function Components( com ) {
    return ( attr, ...arg ) => {
        function reRender( ) {
            // 创建 Ks
            randers =  reRender
            const d = com( attr,...arg )

            console.log(com,Ks)
            let sta = {
                // type: 'components',
                // attr,
                // children: arg,
                reRender,
                states: Ks
            }
            states.push(sta)
            Ks = []
            randers = null
            return d
        }
        return reRender
    }
}

function paresChild(child) {
    if ( child instanceof Array ) {
        return child.map(paresChild)
    }

    if ( child instanceof Function ) {
        return child()
    }
    return child
}

function dom( type, attr, ...child) {
    return {
        type,
        attr,
        child: paresChild(child)
    }
}

let data, sateKey;
function useState( init ) {
    
    let d = data || init
    let keys = Ks.length
    let reload = randers
    function prv( ) {
        return {keys, prvs: data}
    }
    
    // 保存该次渲染使用的值
    // prvs = data
    function set( n ) {
        let{keys, prvs} = prv()
        // if ( prvs === n ) return
        sateKey = keys
        console.log(n, {keys, prvs})
        
        return reload()
    }
   console.log(init,Ks )
    Ks.push([prv, set])
    data = null
    // sateKey = null
    // prv = null
    return d
}

let aa = 11

function C(attr,...children) {
    let a = useState(1)
    console.log('C ', a)
    return (
        dom('C',{a: a + 3},
            a + 1,
            children
        )
    )
}

function B(attr, ...children) {
    let b = useState(2)
    console.log('B', b)
    return (
        dom('B',{b: attr.b + 4},
            b + 1,
            children
        )
    )
}

let Caa = Components( C )
let Cbb = Components( B )

function App() {
    return (
        dom('div',{},
            'bb',
            Caa({
                a: aa + 1
            },
                // Cbb({b:1000},
                //     aa + 'idBB'
                // )
                'Caa'
            )    
        )
    )
}

App()


// reload() = k