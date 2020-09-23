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
  $.loaded(() => {
      console.log('pp', i++)
    })
  $.die(()=>{
    console.log('p die', i++)
  })
  return (
    <p>{$.data} - {i} {this.data.l}</p>
  )
}

const P = Components(po)

let d = true
let num = 0
function Index() {
  // const $ = useState(0)
  // $.computer(() => {
  //   // num = i + 1 + (d?10:32)
  // })
  // $.loaded(() => {
  //     console.log('isLOADE')
  //     // setInterval(()=>{
  //     //   d = !d
  //     //   $.setState( v => {
  //     //     console.log(v)
  //     //     return v+1
  //     //   } )
  //     //   console.log($.data)
  //     // },2000)
  //   }
  // )
  // const sroc = useState(0)
              // .loaded(() => {
              //   console.log('isLOADE')
              // })
  

  // console.log(<p>{$.data} {d}</p>)
  // const d1 = 
// console.log(d1.children[0]())
// {d ? <P l={$.data} /> : null}
//       {d}
// ins {num} {sroc.data}
//     <div onClick={()=>{
//       // i= i+1sdfs
//       d = !d
//       $.setState(num)
//     }}>
//       i++ {d}
//     </div>
//     <div onClick={()=>{
//       // i= i+1

//       num = num + 1
//       console.log(num,'sddd')
//       console.log(num,'sddd')
//       $.setState(num)
//     }}>
//       i++ {d}

//     sd d -----
//     </div>
//     <div
//       class="scroll"
//       onScroll={(el)=>{
//         sroc.setState(el.scrollTop)
//       }}
//     >
//     {
//       dd.map( (v, i) => (
//         <Card class={d}>
//           {
//             dd.map( v => <h1>{v}</h1>)
//           }
//         </Card>
//       ))
//     }
//     </div>
const dd =new Array(10000).fill(0)
  return (
    <div class='page'>
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
