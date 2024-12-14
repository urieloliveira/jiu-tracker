"use client";
import { getLabel } from "@/components/create-match/data";
import { useMatch } from "./live.hook";
import FighterCard from "@/components/fighter-card";
import Timer from "@/components/timer";
import { useParams } from "next/navigation";

export default function Live() {
  const { id } = useParams();
  const { fighters, match } = useMatch({
    id: id as string,
  });

  return (
    <div className="flex flex-col h-screen gap-2 bg-zinc-950">
      {fighters
        .sort((a, b) => a.position - b.position)
        .map((fighter) => (
          <FighterCard
            key={fighter.id}
            mode="view"
            fighter={fighter}
            scoreBgColor={
              fighter.position === 1 ? "bg-yellow-600" : "bg-zinc-950"
            }
            scoreColor={
              fighter.position === 1 ? "text-green-800" : "text-white"
            }
          />
        ))}
      <div className="flex-1 flex gap-2 p-8 items-center justify-between">
        {match && (
          <div className="flex flex-col gap-2">
            <h3 className="text-4xl font-bold">
              {getLabel(match.gender_key, "genders")} •{" "}
              {getLabel(match.age_key, "ages")} •{" "}
              {getLabel(match.belt_key, "belts")} •{" "}
              {getLabel(match.category_key, "categories")}
            </h3>
            <p className="text-lg">
              {fighters?.[0]?.name.toUpperCase()} vs{" "}
              {fighters?.[1]?.name.toUpperCase()}
            </p>
          </div>
        )}
        <Timer id={id as string} mode="view" />
      </div>
    </div>
  );
}
