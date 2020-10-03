import dom, { Components, useState } from 'dom';

import './index.scss'
import {useAdd} from './state'

import Card from './Card'
import Effect from './Effect'


function time() {
  const $ = useAdd(12)
  // 注意不能使用解析赋值，这会导致无法更新UI
  // const {state} = $，这是不可以的，也是这个框架的缺点
  return (
    <div>
      <h1>use 的封装 {$.now}</h1>
      <p> $.state = {$.state} </p>
      <p> computer 计算 {$.mul + 1} </p>
      <p onClick={$.add.bind(null, 5)}> 点这里 state + 5 </p>
    </div>
  )
}

const Time = Components(time)

// function Index() {
//   const $ = useAdd(12)
//   const show = useState(true)
//   // 注意不能使用解析赋值，这会导致无法更新UI
//   // const {state} = $，这是不可以的，也是这个框架的缺点
 
//   console.log(<Card class={false} show={show.state} >ddd </Card>)
//   return (
//     <div>
//       <h2 flex>d</h2>
//         <h1>use 的封装 {$.now}</h1>
//         <p> $.state = {$.state} </p>
//         <p> computer 计算 {$.mul + 1} </p>
//         <p onClick={$.add.bind(null, 5)}> 点这里 state + 5 </p>
//         <h2>time components</h2>
//         <Time></Time>
//       <h2 onClick={
//         () => {
//           console.log(show.state)
//           show.setState(!show.state)
//         }
//       }> show card </h2>
//       <Card class={false} show={show.state} >ddd </Card>
//     </div>
//   )

// }


// function Index() {
//   // const $ = useAdd(12)
//   const show = useState(true)
//   // 注意不能使用解析赋值，这会导致无法更新UI
//   // const {state} = $，这是不可以的，也是这个框架的缺点
//   const list = new Array(3000).fill('5').map( v => (Math.random()*100 | 0)+'')
//   const shreach = useState(list)

//   // <h4>{list.join(',')}</h4>

//   // <p>{show.state}</p>
//   // {
//   //   list.map( v => (
//   //     <p>{v}</p>
//   //   ))
//   // }
//   let value;
//   return (
//     <div>
//       <i>dd</i>
//       {
//         [shreach.state.slice(0,3).map( v => (
//           <p>{v}</p>
//         ))]
//       }
//       <input onInput={el => {
//         // 增删
//         value = el.value
//         shreach.setState(s => list.filter( v => v === el.value))
//         // 替换
//         // shreach.setState(s => list.map( v => el.value))
//         console.log(shreach.state)
//         // show.setState(el.value)
//       }} />
//       {
//         [shreach.state.map( v => (
//           <p>
//             <span>d</span>
//             {v}
//           </p>
//         ))]
//       }
      
      
      
      
//     </div>
//   )

// }

// 数组嵌套 bug
// 由于 每次 hooks 都挂载到 vdom 上
// 直接嵌套时，父组件的的 hooks 会覆盖子组件，所以这里不能用赋值，只能用 unshift
const Effects = Components(function() {
  const $ = useState("---111231231---")
  let p = this.props.state
  $.useEffect(()=>{
    console.log(this.props.state, 'useEffect')
    p = this.props.state === "ttttt"
},()=> this.props.state)
  return <Effect a={p}>{$.state}</Effect>
})

// useEffect 测试
function Index() {
  const show = useState(true)
  // console.log(<Effects state={show.state} />)
  return (
    <div>
      <p onClick={()=>{
        show.setState(show.state=== "ttttt"?"aa": "ttttt")
      }}>{show.state}</p>
      <hr/>
      <Effects state={show.state} />
      <Effects state={show.state} />
      </div>
  )
}
// {
//   [shreach.state.map( v => (
//     <p>
//       {v}
//     </p>
//   ))]
// }
export default Components(Index)
