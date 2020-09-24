import { useState } from 'dom';

export function useAdd(start = 0) {
    const $ = useState()

    const data = {}
    data.state = start
    data.mul = start
    data.add= (n) => {
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
    return data
}