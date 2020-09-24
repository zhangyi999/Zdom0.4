import { useState } from 'dom';

export function useAdd(start = 0) {
    const $ = useState()
    const data = {
        state: start,
        add(n) {
            this.state += ( n || 1) 
            $.setState()
        }
    }
    $.loaded(()=>{
        setTimeout(() => {
            data.state = 40
            $.setState()
        }, 1000)
    })
    return data
}