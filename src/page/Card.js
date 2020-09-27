import dom, {Components} from 'dom';

function Card() {
  // console.log(this.children[0])
  return (
      
      <div class={'Card ' + this.props.class}> 
        {
            this.props.show?
            <p>{this.children}</p> :
            null
        }
      </div>
      
  )
}

export default Components(Card)
