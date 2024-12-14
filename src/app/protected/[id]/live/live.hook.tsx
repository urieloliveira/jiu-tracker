import { Fighter } from "@/components/fighter-card/types";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useTimers } from "@/components/timer/hook";
import { Database } from "@/utils/supabase/types";
import { RealtimePostgresUpdatePayload } from "@supabase/supabase-js";
import { Match } from "../match/match.hook";

export const useMatch = ({ id }: { id: string }) => {
  const [fighters, setFighters] = useState<Fighter[]>([]);
  const [match, setMatch] = useState<Match | null>(null);
  const { reset } = useTimers();
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("matches")
        .select(
          `
          *,
          match_fighters (
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
        status: data.status,
        belt_key: data.belt_key,
        category_key: data.category_key,
        gender_key: data.gender_key,
        age_key: data.age_key,
      });
      setFighters(
        data.match_fighters.map(
          (
            mf: Database["public"]["Tables"]["match_fighters"]["Row"] & {
              fighters: Database["public"]["Tables"]["fighters"]["Row"];
            }
          ) => ({
            id: mf.fighter_id,
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
    };

    fetchData();
  }, []);

  const onUpdated = (
    payload: RealtimePostgresUpdatePayload<{
      id: string;
      match_id: string;
      fighter_id: string;
      advantages: number;
      points: number;
      penalties: number;
      winner_by: string | null;
    }>
  ) => {
    if (payload.new.match_id !== id) return;
    const matchFighterUpdated = payload.new;
    const updatedFighterIndex = fighters.findIndex(
      (fighter) => fighter.id === matchFighterUpdated.fighter_id
    );
    const updatedFighter: Fighter = {
      id: matchFighterUpdated.fighter_id,
      name: fighters[updatedFighterIndex].name,
      team: fighters[updatedFighterIndex].team,
      winnerBy: matchFighterUpdated.winner_by || undefined,
      scores: {
        advantages: matchFighterUpdated.advantages,
        penalties: matchFighterUpdated.penalties,
        points: matchFighterUpdated.points,
      },
    };
    setFighters((prev) => {
      return [
        ...prev.slice(0, updatedFighterIndex),
        updatedFighter,
        ...prev.slice(updatedFighterIndex + 1),
      ];
    });
  };

  useEffect(() => {
    const channel = supabase
      .channel("match_fighters")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "match_fighters" },
        onUpdated
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [supabase, onUpdated]);

  return {
    match,
    fighters,
  };
};
