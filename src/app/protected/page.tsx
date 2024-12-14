"use server";
import CreateMatch from "@/components/create-match";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { MoreVertical } from "lucide-react";
import { signOutAction } from "../actions";
import { createClient } from "@/utils/supabase/server";
import { getLabel } from "@/components/create-match/data";
import { Database } from "@/utils/supabase/types";
import Link from "next/link";

export type MatchData = Database["public"]["Tables"]["matches"]["Row"] & {
  fighters: Array<
    Database["public"]["Tables"]["fighters"]["Row"] & {
      advantages: number;
      points: number;
      penalties: number;
    }
  >;
};

export default async function ProtectedPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.from("matches").select(`
      *,
      match_fighters (
        advantages,
        points,
        penalties,
        fighter_id,
        fighters: fighter_id (*)
      )
    `);

  if (error) {
    console.error("Erro ao buscar dados:", error);
    return <p>Erro ao carregar os dados.</p>;
  }

  const matches: MatchData[] =
    data?.map((match) => ({
      ...match,
      fighters: match.match_fighters.map(
        (
          mf: Database["public"]["Tables"]["match_fighters"]["Row"] & {
            fighters: Database["public"]["Tables"]["fighters"]["Row"];
          }
        ) => ({
          ...mf.fighters,
          advantages: mf.advantages,
          points: mf.points,
          penalties: mf.penalties,
        })
      ),
    })) || [];

  return (
    <div className="flex flex-col items-center p-4 min-h-screen">
      <header className="max-w-5xl w-full flex justify-between items-center">
        <div className="flex flex-col space-y-2">
          <h1 className="text-2xl font-bold">Jiu Tracker</h1>
        </div>
        <div className="flex items-center gap-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="default">Nova Luta</Button>
            </DialogTrigger>
            <CreateMatch
              onCompleted={() => {
                // implement create match action
              }}
            />
          </Dialog>
          <Button type="submit" variant="outline" onClick={signOutAction}>
            Sign out
          </Button>
        </div>
      </header>
      <div className="max-w-5xl w-full md:px-4 py-4">
        {matches && matches.length > 0 ? (
          <div className="grid md:grid-cols-1 md:gap-4 md:mt-4 sm:grid-cols-1 gap-2">
            {matches.map((match) => (
              <div
                key={match.id}
                className="relative flex items-center rounded-md border py-4 pl-6 pr-4 bg-zinc-900"
              >
                <div className="absolute left-0 rounded-l-md w-3 h-full bg-blue-800 mr-4" />
                <div className="flex-1 space-y-3">
                  <p className="text-sm text-muted-foreground">
                    {getLabel(match.gender_key, "genders")} •{" "}
                    {getLabel(match.age_key, "ages")} •{" "}
                    {getLabel(match.belt_key, "belts")} •{" "}
                    {getLabel(match.category_key, "categories")}
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                      <p className="text-lg font-semibold leading-none">
                        {match.fighters?.[0]?.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {match.fighters?.[0]?.team}
                      </p>
                    </div>
                    <span className="text-2xl text-muted-foreground">vs</span>
                    <div className="flex flex-col">
                      <p className="text-lg font-semibold leading-none">
                        {match.fighters?.[1]?.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {match.fighters?.[1]?.team}
                      </p>
                    </div>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="secondary" size="icon">
                      <MoreVertical />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <Link href={`/protected/${match.id}/match`}>
                      <DropdownMenuItem>
                        <span>Iniciar</span>
                      </DropdownMenuItem>
                    </Link>
                    <Link href={`/protected/${match.id}/live`}>
                      <DropdownMenuItem>
                        <span>Live</span>
                      </DropdownMenuItem>
                    </Link>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center p-4">
            <p className="text-center">Nenhuma luta disponível</p>
          </div>
        )}
      </div>
    </div>
  );
}
