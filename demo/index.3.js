
let reload = []
let u;

// function use(init) {
//     if ( !u ) u = init
//     return u
// }

// function Renders(C) {
//     return data => C(data)
// }

// function As(data) {

//     const aa = use(0)
//     return {data,aa}
// }

// let app = Renders(As)

// function a(data) {
//     reload = () => app(data)
//     return app(data)
// }
// let l = a(123)
let data,uses = [],usekeys=0,uu=[];
function useState(init) {
    console.log(init)
    if ( !data ) data = init
    let key = usekeys
    function set(n) {
        console.log(n, this.key)
        return reload[this.key]()
    }
    uses.push({key,init, set})
    return data
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


function Components( com ) {

    return ( attr, ...child ) => {
        console.log('Com()', com)
        let key = reload.length
        reload.push(() => {
            console.log('com()()', com)
            usekeys=key
            // uses[key] = uu
            const c = com(attr, ...child)
            // uu = []
            return c
        })
        return () => reload[key]()
    } 
}

function  a1(attr, ...children) {
    console.log('a1')
    const d = useState('u_a')
    const d1 = useState('u_a1')
    return dom('a1',{a:attr.a, a1use:d, a2use:d1},children)
}

function  b1(attr, ...children) {
    const d = useState('u_b1')
    console.log('b1')
    return dom('b1',{a:attr.a,a1use:d},children)
}

function d1() {
    console.log('d1')
    return dom('d1',{},
        a1({},'d1->a1')
    )
}

let ac = Components(a1)
let bc = Components(b1)

function app() {
    return (
        // dom('app',{},
        //     ac({a:2},
        //         dom('div',{},'child'),
        //         bc({a:2},'aichild'),
        //         // d1()
        //     )
        // )
        dom('app',{},bc({a:2},'aichild'))
    )
}

JSON.stringify(app(), null, 2);

// reload[0]() 'b1'

// reload[1]() 'a1 b1'

// div 
// -> Com(bc)
// -> Com(d1)
// -> Com(ac)
// -> app
// -> u_a
// -> u_a1
// -> div
// -> u_b1
// -> bc()
// -> u_a
// -> u_a1
// -> d1()
// -> ac()
