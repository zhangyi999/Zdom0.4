let children = [
    1,
    '',
    null,
    [{props:{ children:['2A', 2.2 ]} }, [3.1, '3B', false]],
    {
        props: {
            children: [ {props:{ children:[true, 4.2]} }, 5]
        }
    }
];

function toArrayTigerVersion( children ) {
    const array = []
    if ( ['boolean','string','number'].includes(typeof children) ) {
        array.push(children)
    } else if( children instanceof Object ) {
        for(const item in children) {
            array.push(...toArrayTigerVersion(children[item]))
        }
    }
    return array
}

// function toArrayTigerVersion( children ) {
//     return children.flatMap(v => v?.props?.children ?? v ?? [])
// }



console.log(toArrayTigerVersion( children ))