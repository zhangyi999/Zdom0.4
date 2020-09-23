import dom, {Components} from 'dom';

function Card() {
  console.log(this.children[0])
  return (
    <div class={'Card ' + this.data.class}> <p>{this.children}</p> </div>
  )
}

export default Components(Card)
