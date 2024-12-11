import React, { createContext, useContext, useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

interface Timer {
  id: string;
  time: number;
  isRunning: boolean;
}

interface TimerContextProps {
  timers: Record<string, Timer>;
  start: (id: string) => void;
  stop: (id: string) => void;
  reset: (id: string, newTime?: number) => void;
  adjustTime: (id: string, amount: number) => void;
  registerTimer: (id: string, initialTime?: number) => void;
}

const TimerContext = createContext<TimerContextProps | undefined>(undefined);

export const TimerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [timers, setTimers] = useState<Record<string, Timer>>({});

  useEffect(() => {
    const channel = supabase
      .channel("timers")
      .on("broadcast", { event: "timer-update" }, (payload) => {
        const { id, time, isRunning } = payload.payload;
        setTimers((prev) => ({
          ...prev,
          [id]: { id, time, isRunning },
        }));
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const intervals: Record<string, NodeJS.Timeout> = {};

    Object.entries(timers).forEach(([id, timer]) => {
      if (timer.isRunning && timer.time > 0) {
        if (!intervals[id]) {
          intervals[id] = setInterval(() => {
            setTimers((prev) => ({
              ...prev,
              [id]: {
                ...prev[id],
                time: prev[id].time - 1,
              },
            }));
          }, 1000);
        }
      } else {
        if (intervals[id]) {
          clearInterval(intervals[id]);
          delete intervals[id];
        }
      }
    });

    return () => {
      Object.values(intervals).forEach(clearInterval);
    };
  }, [timers]);

  const updateTimerState = (id: string, time: number, isRunning: boolean) => {
    setTimers((prev) => ({
      ...prev,
      [id]: { id, time, isRunning },
    }));

    supabase.channel("timers").send({
      type: "broadcast",
      event: "timer-update",
      payload: { id, time, isRunning },
    });
  };

  const registerTimer = (id: string, initialTime = 0) => {
    setTimers((prev) => {
      if (prev[id]) return prev; // Não registra se já existe
      return {
        ...prev,
        [id]: { id, time: initialTime, isRunning: false },
      };
    });
  };

  const start = (id: string) => {
    const timer = timers[id];
    if (timer) updateTimerState(id, timer.time, true);
  };

  const stop = (id: string) => {
    const timer = timers[id];
    if (timer) updateTimerState(id, timer.time, false);
  };

  const reset = (id: string, newTime = 0) => {
    updateTimerState(id, newTime, false);
  };

  const adjustTime = (id: string, amount: number) => {
    const timer = timers[id];
    if (timer)
      updateTimerState(id, Math.max(timer.time + amount, 0), timer.isRunning);
  };

  return (
    <TimerContext.Provider
      value={{ timers, start, stop, reset, adjustTime, registerTimer }}
    >
      {children}
    </TimerContext.Provider>
  );
};

export const useTimers = () => {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error("useTimers must be used within a TimerProvider");
  }
  return context;
};

export const formatTime = (time: number): string => {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};
