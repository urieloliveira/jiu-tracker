"use client";
import Timer from "@/components/timer";
import { useMatch } from "./match.hook";
import FighterCard from "@/components/fighter-card";
import MatchActions from "@/components/match-actions";
import { Dialog } from "@/components/ui/dialog";
import FinishMatchDialog from "@/components/finish-match-dialog";
import { useParams, useRouter } from "next/navigation";
import { getLabel } from "@/components/create-match/data";

export default function Match() {
  const { id } = useParams();
  const router = useRouter();
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
    leaveMatch,
    onComplete,
  } = useMatch({ id: id as string });

  return (
    <div className="flex flex-col h-screen gap-2 bg-zinc-950">
      <Dialog open={finished} onOpenChange={finishMatch}>
        {fighters
          .sort((a, b) => a.position - b.position)
          .map((fighter) => {
            return (
              <FighterCard
                mode="edit"
                fighter={fighter}
                actions={{
                  setAdvantages: (advantages) =>
                    setAdvantages(fighter?.id, advantages),
                  setPenalties: (penalties) =>
                    setPenalties(fighter?.id, penalties),
                  setPoints: (points) => setPoints(fighter?.id, points),
                  setWinner: (value) => setWinner(fighter?.id, value),
                }}
                ended={ended}
                scoreBgColor={
                  fighter.position === 1 ? "bg-yellow-600" : "bg-zinc-950"
                }
                scoreColor={
                  fighter.position === 1 ? "text-green-800" : "text-white"
                }
              />
            );
          })}
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
            leaveMatch={leaveMatch}
            ended={ended}
            endMatch={switchEnded}
          />
        </div>
        <Timer id={id as string} mode="edit" disabled={ended} />
      </div>
    </div>
  );
}
