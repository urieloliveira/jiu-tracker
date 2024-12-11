import clsx from "clsx";
import ScoreActions, { EndedActions } from "../score-actions";
import Counter from "../counter";
import { FighterCardProps } from "./types";

export default function FighterCard(props: FighterCardProps) {
  return (
    <div className="flex-1 flex">
      <div
        className={clsx(
          "flex flex-col flex-1 px-8 gap-4 bg-zinc-900",
          props.mode === "view" ? "justify-center py-20" : "justify-start py-8"
        )}
      >
        <div
          className={clsx(
            "flex gap-4",
            props.mode === "edit" ? "flex-row items-end" : "flex-col"
          )}
        >
          <h1 className="text-5xl font-bold">
            {props.fighter?.name.toUpperCase()}
          </h1>
          <p className="text-2xl text-muted-foreground">
            {props.fighter?.team.toUpperCase()}
          </p>
        </div>
        {props.mode === "edit" && props.ended && (
          <EndedActions setWinner={props.actions!.setWinner} />
        )}
        {props.mode === "edit" && !props.ended && (
          <ScoreActions
            setAdvantages={props.actions!.setAdvantages}
            setPenalties={props.actions!.setPenalties}
            setPoints={props.actions!.setPoints}
          />
        )}
      </div>
      <div className="flex items-center bg-zinc-900">
        <div className="flex flex-col items-center justify-center text-center gap-4">
          <Counter
            value={props.fighter?.scores.advantages ?? 0}
            title="vantagem"
            color="text-green-600"
          />
          <Counter
            value={props.fighter?.scores.penalties ?? 0}
            title="penalidades"
            color="text-red-600"
          />
        </div>
        <div
          className={clsx(
            "flex-1 flex items-center justify-center h-full w-52",
            props.scoreBgColor
          )}
        >
          <p className={clsx("text-9xl leading-7 font-bold", props.scoreColor)}>
            {props.fighter?.scores.points ?? 0}
          </p>
        </div>
      </div>
    </div>
  );
}
