import dom, {Components, useState} from 'dom';

function Effect() {
    const $ = useState(0)
    $.useEffect(()=>{
        console.log(this.props.a, 'useEffect')
        if ( this.props.a === true ) {
            $.setState(1)
        } else {
            $.setState(0)
        }
    },()=> this.props.a)
    return (
        <span style="color:red">{$.state} {this.children}</span>
    )
}

export default Components(Effect)