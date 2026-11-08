// [TV3] Bộ đếm ngược thời gian thực, tự khóa nút khi phiên đấu giá về 0
import React, { useState, useEffect } from 'react';

export default function CountdownTimer({ endTime, onExpire }) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const difference = new Date(endTime).getTime() - new Date().getTime();
    if (difference <= 0) {
      return { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      total: difference,
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);

      if (remaining.total <= 0) {
        clearInterval(timer);
        if (onExpire) {
          onExpire();
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  if (timeLeft.total <= 0) {
    return (
      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-semibold bg-red-100 text-red-700">
        Phiên đã kết thúc
      </span>
    );
  }

  return (
    <div className="flex items-center space-x-1 font-mono text-xs text-amber-700 font-semibold">
      <span>⏳ Còn lại:</span>
      <span>
        {timeLeft.days > 0 && `${timeLeft.days}d `}
        {String(timeLeft.hours).padStart(2, '0')}:
        {String(timeLeft.minutes).padStart(2, '0')}:
        {String(timeLeft.seconds).padStart(2, '0')}
      </span>
    </div>
  );
}
