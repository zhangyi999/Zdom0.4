import dom, { Components, useState } from 'dom';

import './index.scss'
import {useAdd} from './state'

import Card from './Card'

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
//   return (
//     <div>
//       <h1>use 的封装 {$.now}</h1>
//       <p> $.state = {$.state} </p>
//       <p> computer 计算 {$.mul + 1} </p>
//       <p onClick={$.add.bind(null, 5)}> 点这里 state + 5 </p>
//       <h2>time components</h2>
//       <Time></Time>
//       <h2 flex>d</h2>
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


function Index() {
  // const $ = useAdd(12)
  const show = useState(true)
  // 注意不能使用解析赋值，这会导致无法更新UI
  // const {state} = $，这是不可以的，也是这个框架的缺点
  const list = new Array(2).fill('5')//.map( v => (Math.random()*100 | 0)+'')
  const shreach = useState(list)
  // <p>{show.state}</p>
  //     {
  //       list.map( v => (
  //         <p>{v}</p>
  //       ))
  //     }
  //     {
  //       shreach.state.map( v => (
  //         <p>{v}</p>
  //       ))
  //     }
  // <h4>{list.join(',')}</h4>
  return (
    <div>
      <input onInput={el => {
        
        shreach.setState(s => list.filter( v => v === el.value))
        console.log(shreach.state)
        show.setState(el.value)
      }} />
      {
        [shreach.state.map( v => (
          <p>
            <span>d</span>
            {v}
          </p>
        ))]
      }
      
      
      
    </div>
  )

}

export default Components(Index)
