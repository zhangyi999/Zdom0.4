let K = []
let states = []
let Ks = []
function Components( com ) {
    return ( ...arg ) => {
        const cc = com( ...arg )
        const sta = {
            c: () => com( ...arg ),
            arg,
            use: Ks
        }
        states.push(sta)
        Ks = []
        return cc
    }
}

function useSate( init ) {
    set = n => {
        init = n
    } 
    Ks.push(init, set)
    return init
}


// function useSate( init ) {
//     console.log(init)
//     const i = init
//     set = n => i = n
//     Ks.push(i, set)
//     return i
// }

function Aa(...arg) {
    return [
        useSate('Aa'),
        ...arg
    ]
}


function Ba(...arg) {
    
    return [
        useSate('Ba'),
        ...arg
    ]
}

function Ca(...arg) {
    return [
        useSate('Ca'),
        ...arg
    ]
}

function Da(...arg) {
    return [
        'Da',
        ...arg
    ]
}

let Aa1 = Components(Aa)

let Ba1 = Components(Ba)

let Ca1 = Components(Ca)

let Da1 = Components(Da)

let Dom = Aa1(
    Ba1(
        Da1(
            'Da11',
            Ca1(1)
        )
    )
)

console.log({ Dom, states })