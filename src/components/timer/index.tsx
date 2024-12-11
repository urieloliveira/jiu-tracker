import { formatTime, useTimers } from "./hook";
import { Pause, Play } from "lucide-react";
import { Button } from "../ui/button";
import { useEffect } from "react";

interface TimerProps {
  id: string;
  mode: "edit" | "view";
  disabled?: boolean;
}

const Timer = ({ id, mode, disabled }: TimerProps) => {
  const { timers, start, stop, adjustTime, registerTimer } = useTimers();
  const timer = timers[id];

  useEffect(() => {
    if (!timer) {
      registerTimer(id, 300); // Define um tempo inicial de 300 segundos (ou outro valor padrão)
    }
  }, [id, timer, registerTimer]);
  if (!timer) return <div>Loading...</div>;

  if (mode === "view") {
    return (
      <div className="text-[12rem] leading-[10rem] font-bold text-muted-foreground">
        {formatTime(timer.time)}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-4 bg-zinc-900 rounded-lg">
      <div className="text-9xl font-bold text-muted-foreground mb-4">
        {formatTime(timer.time)}
      </div>
      <div className="flex gap-4">
        <Button
          variant="secondary"
          onClick={() => adjustTime(id, -30)}
          disabled={disabled}
        >
          -30s
        </Button>
        <Button
          variant="secondary"
          onClick={() => adjustTime(id, -1)}
          disabled={disabled}
        >
          -1s
        </Button>
        <Button
          disabled={disabled}
          size="icon"
          variant="secondary"
          onClick={() => (timer.isRunning ? stop(id) : start(id))}
        >
          {timer.isRunning ? <Pause /> : <Play />}
        </Button>
        <Button
          variant="secondary"
          onClick={() => adjustTime(id, 1)}
          disabled={disabled}
        >
          +1s
        </Button>
        <Button
          variant="secondary"
          onClick={() => adjustTime(id, 30)}
          disabled={disabled}
        >
          +30s
        </Button>
      </div>
    </div>
  );
};

export default Timer;
