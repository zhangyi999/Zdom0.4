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
function Index() {
  const $ = useState(0)
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
  return (
    <div class='page'>
    ins
      <Card class={d}>
        asdfdsfsd {d}
      </Card>
      <div onClick={()=>{
        // i= i+1
        d = !d
        $.setState(i)
      }}>
        i++ {d}
      </div>
    </div>
  )
}


export default Components(Index)
