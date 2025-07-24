import { useState, useEffect, useCallback } from "react";

interface OTPTimerHookProps {
  duration: number; // Duration in seconds
  onExpire?: () => void; // Optional callback when the timer expires
  autoStart?: boolean; // Whether to start automatically
}

interface OTPTimerHookResult {
  timeLeft: string;
  otpExpired: boolean;
  timeLeftSeconds: number;
  resetTimer: () => void;
  isRunning: boolean;
}

const useOTPTimer = ({
  duration,
  onExpire,
  autoStart = true,
}: OTPTimerHookProps): OTPTimerHookResult => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [otpExpired, setOtpExpired] = useState(false);
  const [isRunning, setIsRunning] = useState(autoStart);

  const resetTimer = useCallback(() => {
    setTimeLeft(duration);
    setOtpExpired(false);
    setIsRunning(true);
  }, [duration]);

  useEffect(() => {
    if (!isRunning) return;
    
    if (timeLeft <= 0) {
      setOtpExpired(true);
      setIsRunning(false);
      if (onExpire) {
        onExpire();
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          setIsRunning(false);
          setOtpExpired(true);
          if (onExpire) {
            onExpire();
          }
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onExpire, isRunning]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  return {
    timeLeft: formatTime(timeLeft),
    timeLeftSeconds: timeLeft,
    otpExpired,
    resetTimer,
    isRunning,
  };
};

export default useOTPTimer;
