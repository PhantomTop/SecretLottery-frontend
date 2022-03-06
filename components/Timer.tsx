import React from 'react'
import { useState, useEffect } from 'react';

const Timer = (props:any) => {
    const {dateTo} = props

    let initialSeconds = Math.floor((dateTo.getTime() - new Date().getTime()) / 1000)
    // console.log(initialSeconds)

    // const {initialMinute = 0,initialSeconds = 0} = props;
    const [leftSecond, setLeftSecond] = useState(initialSeconds)
    const [ days, setDays ] = useState(0);
    const [ hours, setHours ] = useState(0);
    const [ minutes, setMinutes ] = useState(0);
    const [seconds, setSeconds ] =  useState(0);

    useEffect(() => {
        setLeftSecond(Math.floor((dateTo.getTime() - new Date().getTime()) / 1000))
    }, [dateTo])
    
    useEffect(()=>{
        let myInterval = setInterval(() => {
            // console.log("==========")
            // console.log(leftSecond)
            // console.log(leftSecond / 86400)
            // console.log(Math.floor(leftSecond / 86400))
            setDays(Math.floor(leftSecond / 86400))
            setHours(Math.floor(leftSecond / 3600) % 24)
            setMinutes(Math.floor(leftSecond / 60) % 60)
            setSeconds(leftSecond % 60)
            setLeftSecond(leftSecond - 1)
        }, 1000)
        return ()=> {
            clearInterval(myInterval);
        };
    });

    return (
        <div>
        { minutes === 0 && seconds === 0 && hours === 0 && days === 0
            ? null
            : <h1> 
                {days < 10 ?  `0${days}` : days} day 
                {' '}{hours < 10 ?  `0${hours}` : hours} hour 
                {' '}{minutes < 10 ?  `0${minutes}` : minutes} min 
                {' '}{seconds < 10 ?  `0${seconds}` : seconds} sec
            </h1> 
        }
        </div>
    )
}

export default Timer;