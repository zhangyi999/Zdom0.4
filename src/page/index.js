import dom, { useState, Components } from 'dom';

import Card  from './Card'


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
  const d1 = <Card>
  asdfdsfsd {d}
</Card>
console.log(d1.children[0]())
  return (
    <div class='page'>
      {d ? <P l={$.data} /> : null}
      {d}
      {d1}
      <div onClick={()=>{
        // i= i+1
        d = !d
        $.setState(i)
      }}>
        i++
      </div>
    </div>
  )
}


export default Components(Index)
