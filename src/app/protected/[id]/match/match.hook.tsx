import { Fighter } from "@/components/fighter-card/types";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useTimers } from "@/components/timer/hook";
import { Database } from "@/utils/supabase/types";
import { revalidatePath } from "next/cache";

export const useMatch = ({ id }: { id: string }) => {
  const router = useRouter();
  const [fighters, setFighters] = useState<Fighter[]>([]);
  const [ended, setEnded] = useState(false);
  const [finished, setFinished] = useState(false);
  const [match, setMatch] = useState<
    Database["public"]["Tables"]["matches"]["Row"] | null
  >(null);
  const { timers, start, stop, reset } = useTimers();
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("matches")
        .select(
          `
          *,
          match_fighters (
            position,
            advantages,
            points,
            penalties,
            fighter_id,
            fighters: fighter_id (*)
          )
        `
        )
        .eq("id", id)
        .single();

      if (error) {
        console.error("Erro ao buscar dados:", error);
        return;
      }

      reset(id, 300 - data.time);
      setMatch({
        id: data.id,
        status: "IN_PROGRESS",
        belt_key: data.belt_key,
        category_key: data.category_key,
        gender_key: data.gender_key,
        age_key: data.age_key,
        time: data.time,
      });
      setFighters(
        data.match_fighters.map(
          (
            mf: Database["public"]["Tables"]["match_fighters"]["Row"] & {
              fighters: Database["public"]["Tables"]["fighters"]["Row"];
            }
          ) => ({
            id: mf.fighter_id,
            position: mf.position,
            name: mf.fighters.name,
            team: mf.fighters.team,
            winnerBy: mf.winner_by,
            scores: {
              advantages: mf.advantages,
              penalties: mf.penalties,
              points: mf.points,
            },
          })
        )
      );

      await supabase
        .from("matches")
        .update({ status: "IN_PROGRESS" })
        .eq("id", id);
    };

    fetchData();
  }, []);

  const updateScore = async (
    fighterId: string,
    key: "points" | "advantages" | "penalties",
    value: number | ((prev: number) => number)
  ) => {
    const currentFighter = fighters.find((fighter) => fighter.id === fighterId);
    if (!currentFighter) {
      console.error("Lutador não encontrado.");
      return;
    }

    const newValue =
      typeof value === "function" ? value(currentFighter.scores[key]) : value;

    try {
      const { error } = await supabase
        .from("match_fighters")
        .update({ [key]: newValue })
        .eq("fighter_id", fighterId)
        .eq("match_id", id);

      if (error) {
        console.error(`Erro ao atualizar ${key} no banco de dados:`, error);
        return;
      }

      setFighters((prev) =>
        prev.map((fighter) =>
          fighter.id === fighterId
            ? {
                ...fighter,
                scores: {
                  ...fighter.scores,
                  [key]: newValue,
                },
              }
            : fighter
        )
      );
    } catch (err) {
      console.error(`Erro ao executar updateScore para ${key}:`, err);
    }
  };

  const setPoints = (
    fighterId: string,
    points: number | ((prev: number) => number)
  ) => updateScore(fighterId, "points", points);

  const setAdvantages = (
    fighterId: string,
    advantages: number | ((prev: number) => number)
  ) => updateScore(fighterId, "advantages", advantages);

  const setPenalties = (
    fighterId: string,
    penalties: number | ((prev: number) => number)
  ) => updateScore(fighterId, "penalties", penalties);

  const resetScores = async () => {
    try {
      const { error } = await supabase
        .from("match_fighters")
        .update({
          points: 0,
          advantages: 0,
          penalties: 0,
        })
        .eq("match_id", id);

      if (error) {
        console.error("Erro ao resetar pontuações no banco de dados:", error);
        return;
      }

      setFighters((prev) =>
        prev.map((fighter) => ({
          ...fighter,
          scores: {
            points: 0,
            advantages: 0,
            penalties: 0,
          },
        }))
      );
    } catch (err) {
      console.error("Erro ao executar resetScores:", err);
    }
  };

  const switchFighters = async () => {
    try {
      await supabase
        .from("match_fighters")
        .update({ position: fighters[1]?.position })
        .eq("fighter_id", fighters[0].id)
        .eq("match_id", id);

      await supabase
        .from("match_fighters")
        .update({ position: fighters[0]?.position })
        .eq("fighter_id", fighters[1].id)
        .eq("match_id", id);

      setFighters((prev) =>
        prev.map((fighter) => ({
          ...fighter,
          position: fighter.position === 1 ? 2 : 1,
        }))
      );
    } catch (err) {
      console.error("Erro ao executar switchFighters:", err);
    }
  };

  const setWinner = (id: string, value: string) => {
    setFighters((prev) =>
      prev.map((fighter) => ({
        ...fighter,
        winnerBy: fighter.id === id ? value : undefined,
      }))
    );
    setFinished(true);
  };

  const switchEnded = () => {
    setEnded(!ended);
    if (ended) {
      start(id);
    } else {
      stop(id);
    }
  };

  const finishMatch = (state: boolean) => {
    if (!state) {
      setFighters((prev) =>
        prev.map((fighter) => ({
          ...fighter,
          winnerBy: undefined,
        }))
      );
      setFinished(false);
    }
  };

  const onComplete = async () => {
    const supabase = createClient();
    const { error } = await supabase.from("match_fighters").upsert(
      fighters.map((fighter) => ({
        match_id: id,
        fighter_id: fighter.id,
        advantages: fighter.scores.advantages,
        points: fighter.scores.points,
        penalties: fighter.scores.penalties,
        winner_by: fighter.winnerBy,
      }))
    );

    if (error) {
      console.error("Erro ao salvar dados:", error);
      return;
    }

    const { error: errorMatch } = await supabase
      .from("matches")
      .update({
        status: "FINISHED",
        time: 300 - timers[id].time,
      })
      .eq("id", id);

    if (errorMatch) {
      console.error("Erro ao salvar dados:", errorMatch);
      return;
    }

    revalidatePath("/protected");
    router.push("/protected");
  };

  const leaveMatch = async () => {
    await supabase.from("matches").update({ status: "PENDING" }).eq("id", id);

    router.push("/protected");
    revalidatePath("/protected");
  };

  return {
    match,
    fighters,
    ended,
    timer: timers[id],
    setAdvantages,
    setPenalties,
    setPoints,
    switchFighters,
    resetScores,
    switchEnded,
    setWinner,
    finished,
    finishMatch,
    leaveMatch,
    onComplete,
  };
};
