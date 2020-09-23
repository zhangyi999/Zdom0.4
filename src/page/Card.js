import dom, { useState, Components } from 'dom';

function Card() {
  return (
    <div class={'Card ' + this.data.class}>{this.children}</div>
  )
}

export default Components(Card)
