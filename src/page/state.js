import { useState } from 'dom';

export function useAdd(start = 0) {
    const $ = useState()
    const time = useState()
    const data = {}
    data.state = start
    data.mul = start
    data.now = new Date().getSeconds()
    data.add = (n) => {
        data.state += ( n || 1) 
        $.setState()
    }

    $.loaded(()=>{
        setTimeout(() => {
            data.state = 40
            $.setState()
        }, 1000)
    }).computer(()=>{
        data.mul= data.mul * data.state
        console.log('state change', data.state)
    })

    let t;
    time.loaded(()=>{
        t = setInterval(() => {
            data.now = new Date().getSeconds()
            time.setState()
        }, 1000);
    }).die(() => {
        clearInterval(t)
    })
    return data
}