import dom, { useState, Components } from 'dom';

import './index.scss'
import Card  from './Card'

// const ins = useState(0)
// setInterval(()=>{
//   ins.setState(ins.data + 1)
// }, 1000)

let i = 1
function po() {
  const $ = useState(9)
  // $.loaded(() => {
  //     console.log('pp', this.children, this.props.l)
  //   })
  // $.die(()=>{
  //   console.log('p die', this.children, this.props.l)
  // })
  return (
    <p>{$.state} {this.children} - {i} {this.props.l} </p>
  )
}

const P = Components(po)

let d = true
let num = 0
function Index() {
  // const $ = useState(0)
  // // $.computer(() => {
  // //   // num = i + 1 + (d?10:32)
  // // })
  // $.loaded(() => {
  //     console.log('isLOADE')
  //     setInterval(()=>{
  //       d = !d
  //       $.setState( v => {
  //         console.log(v)
  //         return v+1
  //       } )
  //       console.log($.data)
  //     },2000)
  //   }
  // )
  // let dd =new Array(1).fill(0)
  // return (
  //   <div class='page'>
  //     {d ? <P l={$.data} /> : null}
  //     {d ? <P l={$.data} >
  //           <P l={44} />
  //         </P> : null}
  //     {d ? <P l={$.data} /> : null}
  //   </div>
  // )
  
  

  const sroc = useState(0)
  let dd =new Array(10000).fill(0)

  return (
    <div class='page'>
      <h1>sss</h1>
      {num % 2 ? <P l={num} /> : null}
      {d ? <P l={num} >
            <P l={44} />
          </P> : null}
      {d ? <P l={num} /> : null}
      <p onClick={()=>{
        num = num + 1
        dd = dd.map(v => <Card class='card'>{num}</Card> )
        sroc.setState()
      }}>dd</p>
      {
        dd.map( v => (
          <div>
            <p>{v}</p>
          </div>
        ))
      }
    </div>
  )
}


export default Components(Index)
