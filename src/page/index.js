import dom, { useState, Components } from 'dom';
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
  return (
    <div class='page'>
      {d ? <P l={$.data} /> : null}
      {d}
      <div onClick={()=>{
        $.setState(i++)
      }}>
        i++
      </div>
    </div>
  )
}


export default Components(Index)
