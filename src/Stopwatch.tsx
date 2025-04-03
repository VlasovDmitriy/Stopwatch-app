import React, { useState, useEffect, useRef } from "react";
import { IoClose } from "react-icons/io5";

type StopwatchProps = {
  onRemove?: () => void;
};

export default function Stopwatch({ onRemove }: StopwatchProps) {
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [buttonPosition, setButtonPosition] = useState({ x: "95%", y: "5%" });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const intervalIdRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  // Обработчик наведения на крестик
  const handleMouseEnter = (e: React.MouseEvent) => {
    if (!containerRef.current || !buttonRef.current || !onRemove) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const buttonRect = buttonRef.current.getBoundingClientRect();
    const mouseX = e.clientX - containerRect.left;
    const mouseY = e.clientY - containerRect.top;

    // Вычисляем новую позицию (убегаем от курсора)
    const escapeDistance = 60;
    let newX = mouseX > containerRect.width / 2 
      ? Math.max(10, buttonRect.left - containerRect.left - escapeDistance)
      : Math.min(containerRect.width - 40, buttonRect.left - containerRect.left + escapeDistance);

    let newY = mouseY > containerRect.height / 2 
      ? Math.max(10, buttonRect.top - containerRect.top - escapeDistance)
      : Math.min(containerRect.height - 40, buttonRect.top - containerRect.top + escapeDistance);

    setButtonPosition({ 
      x: `${newX}px`, 
      y: `${newY}px` 
    });
  };

  // Таймер
  useEffect(() => {
    if (isRunning) {
      intervalIdRef.current = setInterval(() => {
        setElapsedTime(Date.now() - startTimeRef.current);
      }, 10);
    }
    return () => {
      if (intervalIdRef.current) clearInterval(intervalIdRef.current);
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
    const milliseconds = Math.floor(elapsedTime % 1000);

    return [
      String(hours).padStart(2, "0"),
      String(minutes).padStart(2, "0"),
      String(seconds).padStart(2, "0"),
      String(milliseconds).padStart(3, "0"),
    ].join(":");
  }

  return (
    <div 
      className="stopwatch" 
      ref={containerRef}
      
      style={{ position: "relative" }} 
    >
      {onRemove && (
        <button
        ref={buttonRef}
        onClick={onRemove}
        className="remove-button"
        onMouseEnter={handleMouseEnter}
        style={{
          position: "absolute",
          left: buttonPosition.x,
          top: buttonPosition.y,
          transition: "left 0.18s linear, top 0.18s linear",
          zIndex: 10,
        }}
      >
        <IoClose />
      </button>
      )}

      <div className="display">{formatTime()}</div>
      <div className="controls">
        <button onClick={start} className="start-button">Start</button>
        <button onClick={stop} className="stop-button">Stop</button>
        <button onClick={reset} className="reset-button">Reset</button>
      </div>
    </div>
  );
}