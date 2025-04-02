import React, { useState, useEffect, useRef } from "react";
import { IoClose  } from "react-icons/io5";

type StopwatchProps = {
    onRemove?: () => void;
}

export default function Stopwatch({ onRemove }: StopwatchProps) {
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const [elapsedTime, setElapsedTime] = useState<number>(0);
    
    const intervalIdRef = useRef<number | null>(null);//коль мы с серверным js работали надо было бы писать NodeJS.Timeout, но в браузере number и похуй
    const startTimeRef = useRef<number>(0);
    
    useEffect(() => {
        if (isRunning) {
            intervalIdRef.current = setInterval(() => {
                setElapsedTime(Date.now() - startTimeRef.current);
            }, 10);
        }
        return () => {
            if (intervalIdRef.current) {
                clearInterval(intervalIdRef.current);
            }
        };
    }, [isRunning]);

    function start(): void {
        setIsRunning(true);
        startTimeRef.current = Date.now() - elapsedTime;
    }

    function stop(): void {
        setIsRunning(false);
    }

    function reset(): void {
        setElapsedTime(0);
        setIsRunning(false);
    }

    function formatTime(): string {
        const hours = Math.floor(elapsedTime / (1000 * 60 * 60));
        const minutes = Math.floor((elapsedTime / (1000 * 60)) % 60);
        const seconds = Math.floor((elapsedTime / 1000) % 60);
        const milliseconds = Math.floor((elapsedTime % 1000));

        const paddedHours = String(hours).padStart(2, "0");
        const paddedMinutes = String(minutes).padStart(2, "0");
        const paddedSeconds = String(seconds).padStart(2, "0");
        const paddedMilliseconds = String(milliseconds).padStart(3, "0");

        return `${paddedHours}:${paddedMinutes}:${paddedSeconds}:${paddedMilliseconds}`;
    }

    return (
        <div className="stopwatch">
            {onRemove && (
        <button 
          onClick={onRemove} 
          className="remove-button"
          
        >
          <IoClose /> 
        </button>
      )}
      
            <div className="display">{formatTime()}</div>
            <div className="controls">
                <button onClick={start} className="start-button">
                    Start
                </button>
                <button onClick={stop} className="stop-button">
                    Stop
                </button>
                <button onClick={reset} className="reset-button">
                    Reset
                </button>
            </div>
        </div>
    );
}