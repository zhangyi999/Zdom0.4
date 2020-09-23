import dom,{render} from 'dom'
import Index from './page'
// console.log(<Index/>)

render(
    () => {
        const i = <Index/>
        window.index = i
        console.log(i,'index')
        return i
    },
    document.getElementById('app')
)
// import


