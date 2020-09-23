import dom, { useState, Components } from 'dom';

function Card() {
  return (
    <div class='Card'>{this.children}</div>
  )
}

export default Components(Card)
