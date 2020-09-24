import dom,{render} from 'dom'
import Index from './page'
// console.log(<Index/>)
render(
    () => {
        return <Index/>
    },
    document.getElementById('app')
)
if (module.hot) {
    module.hot.accept();
}
// import


