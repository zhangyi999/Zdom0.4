let states = []
let Ks = []
let randers
function Components( com ) {
    return ( attr, ...arg ) => {
        // 创建 rander 
        randers = () =>  Components( com )( attr,...arg )
        const obj = {}
        Object.keys(attr).map( k => {
            obj[k] = attr[k] instanceof Function ? attr[k]() : attr[k]
        })
        const ac = []
        arg.map( v => {
            ac.push( v instanceof Function ? v() : v)
        })

        // 创建 Ks
        const cc = com( obj,...ac )
        randers.Ks = Ks
        const sta = {
            randers,
            attr,
            children: arg,
            use: Ks
        }
        states.push(sta)
        randers = null
        Ks = []
        return cc
    }
}

function dom( attr, ...arg ) {
    const obj = {}
    Object.keys(attr).map( k => {
        obj[k] = attr[k] instanceof Function ? attr[k]() : attr[k]
    })
    const ac = []
    arg.map( v => {
        ac.push( v instanceof Function ? v() : v)
    })
    return {
        attr: obj,
        children: ac
    }
}

// useSate 和 set 是量个状态保存机器
// let ss,change=null;
// function useSate( init ) {
//     // const a = {data: init}
//     console.log(ss, change, init,'changechangechange')
//     if ( !ss || change !== init  ) ss = init
//     let reload = randers
//     console.log(randers,'randersranders')
//     set = n => {
//         console.log(init,'initinit')
//         change = init
//         console.log(reload,'reree')
//         ss = n
//         console.log(n)
//         return reload()
//         // $.data = n
//     } 
//     Ks.push([init, set])
//     let o = ss || change;
//     (change !== null && change !== init ) ? null : change = null;
//     ss = null
//     return o
// }

// useSate 和 set 是量个状态保存机器，保存 init，data【当前】，prv【前值】，change【未来】，key【在用一个组件里的调用顺序】
let data, prv, sateKey;
function useSate( init ) {
    // 保存 重新渲染 组件函数
    let reload = randers;
    // 保存在用一个组件里的调用顺序
    let keys = Ks.length
    let prvs;
    // 确保不是首次渲染
    console.log(reload.Ks, 'reload.Ks')
    console.log( {data, prv, sateKey, keys},'1' )
    if ( data ) {
        console.log( {data, prv, sateKey, keys} )
        // 二次渲染且不是该 use 改变
        if ( keys !== sateKey ) {
            data = prv
        }
    }  else data = init
    
    // 保存该次渲染使用的值
    prvs = data
    set = n => {
        if ( n instanceof Function ) {
            n = n(prvs)
        }
        if ( n === prvs ) return
        prv = prvs
        data = n
        sateKey = keys
        return reload()
        // $.data = n
    } 
    Ks.push([{init,prvs}, set])
    data = null
    sateKey = null
    prv = null
    return prvs
}

let aa = 1

function A( attr, ...children ) {
    console.log('render A')
    const a = useSate( 1 )
    const a1 = useSate( 10000 )
    console.log({a,a1})
    return (
        dom({
            A: () => attr.a + 1 + a
        },
            () => 'A' + a1,
            children,
            () => {
                console.log(a) 
                return a === 1 ? 'true': 'false'
            },
            dom({
                b: () => 'A' + a
            },
                () => 'dom' + a
            )
        )
    )
}

function B( attr, ...children ) {
    const a = useSate( 2 )
    // console.log(a,'A')
    return (
        dom({
            B: () => a
        },
            'B',
            children,
            () => {
                console.log(a) 
                return a === 2 ? 'trueB': 'falseB'
            },
            dom({
                b: () => 'A' + a
            },
                () => 'dom' + a
            )
        )
    )
}

let Caa = Components(A)
let Cbb = Components(B)

let D = (
    dom({},
        'bb',
        Caa({
            a: () => aa + 1
        },
            'aa',
            () => aa + 'id',
            Cbb({},
                () => aa + 'idBB'
            )
        )    
    )
)

console.log(D)