import { Fighter } from "../fighter-card/types";
import { Button } from "../ui/button";
import {
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { formatTime } from "../timer/hook";

interface FinishMatchDialogProps {
  fighters: Fighter[];
  time: number;
  onComplete: () => void;
}

export default function FinishMatchDialog(props: FinishMatchDialogProps) {
  const winner = props.fighters.find((fighter) => fighter.winnerBy) as Fighter;

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Luta Finalizada</DialogTitle>
      </DialogHeader>
      <div className="p-4">
        {winner ? (
          <div className="flex flex-col gap-4 text-center">
            <div>
              <p className="text-xl font-semibold bg-green-600 p-2 rounded">
                Vitória por {winner.winnerBy}
              </p>
              <p className="text-4xl font-semibold mt-2">{winner.name}</p>
              <p className="text-lg text-muted-foreground">{winner.team}</p>
            </div>
            <div className="text-8xl font-bold text-muted-foreground p-4 rounded-xl bg-zinc-900">
              <h3 className="text-2xl">Tempo total</h3>
              <p>{formatTime(300 - props.time)}</p>
            </div>
          </div>
        ) : (
          <p className="text-center text-xl">A luta terminou empatada.</p>
        )}
      </div>
      <DialogFooter className="mt-4">
        <DialogClose asChild>
          <Button variant="secondary">Voltar</Button>
        </DialogClose>
        <Button onClick={props.onComplete}>Concluir</Button>
      </DialogFooter>
    </DialogContent>
  );
}
