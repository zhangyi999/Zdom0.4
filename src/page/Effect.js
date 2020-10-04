import dom, {Components, useState} from 'dom';

function deplay() {
    return new Promise(r => setTimeout(r, 1000))
}

function uesEs(call) {
    const $ = useState(0)
    $.useEffect( async ()=>{
        console.log(call(), 'useEffect')
        $.setState("loading...")
        await deplay()
        if ( call() === true ) {
            $.setState(1)
        } else {
            $.setState(0)
        }
    },call)
    return $
}

function Effect() {
    const $ = uesEs(() => this.props.a )
    return (
        <span style="color:red"> {$.state} {this.children}</span>
    )
}

export default Components(Effect)