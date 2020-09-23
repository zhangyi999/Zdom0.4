import dom, { useState, Components } from 'dom';

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
  const $ = useState(0)
  $.computer(() => {
    // num = i + 1 + (d?10:32)
  })
  $.loaded(() => {
      console.log('isLOADE')
      // setInterval(()=>{
      //   d = !d
      //   $.setState( v => {
      //     console.log(v)
      //     return v+1
      //   } )
      //   console.log($.data)
      // },2000)
    }
  )
              // .loaded(() => {
              //   console.log('isLOADE')
              // })
  

  // console.log(<p>{$.data} {d}</p>)
  // const d1 = 
// console.log(d1.children[0]())
// {d ? <P l={$.data} /> : null}
//       {d}
const dd =new Array(10000).fill(0)
  return (
    <div class='page'>
    ins {num}
    <div onClick={()=>{
      // i= i+1
      d = !d
      $.setState(num)
    }}>
      i++ {d}
    </div>
    <div onClick={()=>{
      // i= i+1

      num = num + 1
      console.log(num,'sddd')
      $.setState(num)
    }}>
      i++ {d}
    </div>
    {
      dd.map( (v, i) => (
        i > 9900?
        <Card class={d}>
          {v} asdfdsfsd {d}
        </Card>:null
      ))
    }
      
     
    </div>
  )
}


export default Components(Index)
