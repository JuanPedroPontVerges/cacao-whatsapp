import React, { useEffect, useState } from "react"
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration)

interface TimerPropsInterface {
    createdAt: Date;
}

const Timer: React.FC<TimerPropsInterface> = ({ createdAt }) => {
    const [timer, setTimer] = useState<string>();
    useEffect(() => {
        const interval = setInterval(() => {
            const ft = dayjs(createdAt);
            const tt = dayjs();
            const mins = tt.diff(ft, "minutes", true);
            const seconds = tt.diff(ft, "seconds", true);
            const totalHours = parseInt((mins / 60).toString());
            const totalMins = dayjs().minute(mins).minute()
            const totalSeconds = dayjs().second(seconds).second()
            setTimer(`${totalHours}:${totalMins}:${totalSeconds}`)
        }, 1000)
        return () => {
            clearInterval(interval);
        }
    }, [])
    return (
        <div className={'text-black text-base font-light w-full'}>
            {timer}
        </div>
    )
}

export default Timer;