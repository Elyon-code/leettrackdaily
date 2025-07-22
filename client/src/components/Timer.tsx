import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Play, Pause, Square, Timer as TimerIcon } from "lucide-react";

interface TimerProps {
  problemId: number;
  problemName: string;
}

export function Timer({ problemId, problemName }: TimerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [duration, setDuration] = useState<number>(30); // minutes
  const [timeLeft, setTimeLeft] = useState<number>(0); // seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            setIsRunning(false);
            setIsFinished(true);
            // Show notification
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification('Time\'s up!', {
                body: `Timer finished for ${problemName}`,
                icon: '/favicon.ico'
              });
            }
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, problemName]);

  const startTimer = () => {
    setTimeLeft(duration * 60); // Convert minutes to seconds
    setIsRunning(true);
    setIsFinished(false);
    
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const stopTimer = () => {
    setIsRunning(false);
    setTimeLeft(0);
    setIsFinished(false);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = (): number => {
    if (duration === 0) return 0;
    return ((duration * 60 - timeLeft) / (duration * 60)) * 100;
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="h-8 px-3"
      >
        <TimerIcon className="h-4 w-4 mr-1" />
        Timer
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Problem Timer</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="text-center">
              <h3 className="font-medium text-lg mb-2">{problemName}</h3>
              
              {!isRunning && timeLeft === 0 && !isFinished && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Select Duration</label>
                    <Select value={duration.toString()} onValueChange={(value) => setDuration(Number(value))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="45">45 minutes</SelectItem>
                        <SelectItem value="60">60 minutes</SelectItem>
                        <SelectItem value="90">90 minutes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button 
                    onClick={startTimer}
                    className="bg-[#FF6B35] hover:bg-orange-600 text-white w-full"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Start Timer
                  </Button>
                </div>
              )}

              {(isRunning || timeLeft > 0) && (
                <div className="space-y-4">
                  <div className="text-6xl font-mono font-bold text-[#FF6B35]">
                    {formatTime(timeLeft)}
                  </div>
                  
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-[#FF6B35] h-2 rounded-full transition-all duration-1000 ease-linear"
                      style={{ width: `${getProgressPercentage()}%` }}
                    />
                  </div>

                  <div className="flex gap-2">
                    {isRunning ? (
                      <Button variant="outline" onClick={pauseTimer} className="flex-1">
                        <Pause className="h-4 w-4 mr-2" />
                        Pause
                      </Button>
                    ) : (
                      <Button 
                        onClick={() => setIsRunning(true)} 
                        className="bg-[#FF6B35] hover:bg-orange-600 text-white flex-1"
                        disabled={timeLeft === 0}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Resume
                      </Button>
                    )}
                    
                    <Button variant="outline" onClick={stopTimer} className="flex-1">
                      <Square className="h-4 w-4 mr-2" />
                      Stop
                    </Button>
                  </div>
                </div>
              )}

              {isFinished && (
                <div className="space-y-4">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    Time's Up! 🎉
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    Great job working on this problem!
                  </p>
                  <Button 
                    onClick={() => {
                      setIsFinished(false);
                      setTimeLeft(0);
                    }}
                    className="bg-[#FF6B35] hover:bg-orange-600 text-white w-full"
                  >
                    Start New Timer
                  </Button>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}