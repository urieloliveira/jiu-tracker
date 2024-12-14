"use client";
import Timer from "@/components/timer";
import { useMatch } from "./match.hook";
import FighterCard from "@/components/fighter-card";
import MatchActions from "@/components/match-actions";
import { Dialog } from "@/components/ui/dialog";
import FinishMatchDialog from "@/components/finish-match-dialog";
import { useParams } from "next/navigation";
import { getLabel } from "@/components/create-match/data";

export default function Match() {
  const { id } = useParams();
  const {
    match,
    fighters,
    ended,
    finished,
    timer,
    setAdvantages,
    setPenalties,
    setPoints,
    setWinner,
    switchFighters,
    resetScores,
    switchEnded,
    finishMatch,
    onComplete,
  } = useMatch({ id: id as string });

  return (
    <div className="flex flex-col h-screen gap-2 bg-zinc-950">
      <Dialog open={finished} onOpenChange={finishMatch}>
        <FighterCard
          mode="edit"
          fighter={fighters?.[0]}
          actions={{
            setAdvantages: (advantages) =>
              setAdvantages(fighters?.[0]?.id, advantages),
            setPenalties: (penalties) =>
              setPenalties(fighters?.[0]?.id, penalties),
            setPoints: (points) => setPoints(fighters?.[0]?.id, points),
            setWinner: (value) => setWinner(fighters?.[0]?.id, value),
          }}
          ended={ended}
          scoreBgColor="bg-yellow-600"
          scoreColor="text-green-800"
        />
        <FighterCard
          mode="edit"
          fighter={fighters[1]}
          actions={{
            setAdvantages: (advantages) =>
              setAdvantages(fighters?.[1]?.id, advantages),
            setPenalties: (penalties) =>
              setPenalties(fighters?.[1]?.id, penalties),
            setPoints: (points) => setPoints(fighters?.[1]?.id, points),
            setWinner: (value) => setWinner(fighters?.[1]?.id, value),
          }}
          ended={ended}
          scoreBgColor="bg-zinc-950"
          scoreColor="text-white"
        />
        <FinishMatchDialog
          fighters={fighters}
          time={timer?.time ?? 300}
          onComplete={onComplete}
        />
      </Dialog>
      <div className="flex-1 flex gap-2 p-8 items-center justify-between">
        <div className="flex flex-col gap-4">
          {match && (
            <div className="flex flex-col gap-2">
              <h3 className="text-4xl font-bold text-white">
                {getLabel(match.gender_key, "genders")} •{" "}
                {getLabel(match.age_key, "ages")} •{" "}
                {getLabel(match.belt_key, "belts")} •{" "}
                {getLabel(match.category_key, "categories")}
              </h3>
              <p className="text-lg text-white">
                {fighters?.[0]?.name.toUpperCase()} vs{" "}
                {fighters?.[1]?.name.toUpperCase()}
              </p>
            </div>
          )}
          <MatchActions
            reset={resetScores}
            switchFighters={switchFighters}
            leaveMatch={() => {}}
            ended={ended}
            endMatch={switchEnded}
          />
        </div>
        <Timer id={id as string} mode="edit" disabled={ended} />
      </div>
    </div>
  );
}
