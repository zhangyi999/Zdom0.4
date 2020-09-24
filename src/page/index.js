import dom, { Components } from 'dom';

import './index.scss'
import {useAdd} from './state'

function Index() {
  const $ = useAdd(12)
  // 注意不能使用解析赋值，这会导致无法更新UI
  // const {state} = $，这是不可以的，也是这个框架的缺点
  return (
    <div>
      <h1>use 的封装</h1>
      <p> $.state = {$.state} </p>
      <p> computer 计算 {$.mul} </p>
      <p onClick={
        () => {
          $.add(5)
        }
      }> 点这里 state + 5 </p>
    </div>
  )
}


export default Components(Index)
