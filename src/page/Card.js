import dom, { useState, Components } from 'dom';

function Card() {
  return (
    <div class={'Card ' + this.data.class}> <p>{this.children}</p> </div>
  )
}

export default Components(Card)
