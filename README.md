# Zdom

轻量级 hook + vue 的接口，仅作为学习用，目前还是一款玩具。

配备了自己的 jsx 编译规则。

## API

```js
import dom, { useState, Components, render } from 'dom';

function index() {
    const $ = useState(0)
    $.loaded(()=>{})
    $.computer(()=>{})
    $.die(()=>{});
    $.setState(3)
    return (
        <div>{$.state}</div>
    )
}

const  Index = Components(index)

render(
    () => <Index />,
    document.getElementById('app')
)
```

```bash
yarn install
yarn dev
```