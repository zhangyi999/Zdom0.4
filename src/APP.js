import dom,{render} from 'dom'
import Index from './page'
// console.log(<Index/>)
console.time(1)
render(
    () => {
        const i = <Index/>
        window.index = i
        console.log(i,'index')
        return i
    },
    document.getElementById('app')
)
console.timeEnd(1)
if (module.hot) {
    module.hot.accept();
}
// import


