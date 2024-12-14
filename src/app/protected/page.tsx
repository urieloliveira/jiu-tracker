"use server";
import CreateMatch from "@/components/create-match";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { MoreVertical } from "lucide-react";
import { signOutAction } from "../actions";
import { createClient } from "@/utils/supabase/server";
import {
  getBeltColor,
  getLabel,
  getStatusColor,
} from "@/components/create-match/data";
import { Database } from "@/utils/supabase/types";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import clsx from "clsx";
import { DeleteMatch } from "@/components/delete-match";
import FilterMatches from "@/components/filter-matches";

export type MatchData = Database["public"]["Tables"]["matches"]["Row"] & {
  fighters: Array<
    Database["public"]["Tables"]["fighters"]["Row"] & {
      position: number;
      advantages: number;
      points: number;
      penalties: number;
    }
  >;
};

export default async function ProtectedPage({
  searchParams,
}: {
  searchParams: Promise<{
    belt_key: string;
    category_key: string;
    gender_key: string;
    age_key: string;
    status: string;
  }>;
}) {
  const supabase = await createClient();
  const { belt_key, category_key, gender_key, age_key, status } =
    (await searchParams) || {};

  let query = supabase.from("matches").select(
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
  );

  if (belt_key) query = query.eq("belt_key", belt_key);
  if (category_key) query = query.eq("category_key", category_key);
  if (gender_key) query = query.eq("gender_key", gender_key);
  if (age_key) query = query.eq("age_key", age_key);
  if (status) query = query.eq("status", status);

  const { data, error } = await query;

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
            <DialogContent>
              <CreateMatch />
            </DialogContent>
          </Dialog>
          <Button type="submit" variant="outline" onClick={signOutAction}>
            Sign out
          </Button>
        </div>
      </header>
      <div className="max-w-5xl w-full md:px-4 py-4">
        <FilterMatches />
        {matches && matches.length > 0 ? (
          <div className="grid md:grid-cols-1 md:gap-4 md:mt-4 sm:grid-cols-1 gap-2">
            {matches.map((match) => (
              <div
                key={match.id}
                className="relative flex items-center rounded-md py-4 pl-6 pr-4 bg-neutral-900"
              >
                <div
                  className={clsx(
                    "absolute left-0 rounded-l-md w-3 h-full mr-4",
                    getBeltColor(match.belt_key)
                  )}
                />
                <div className="flex-1 space-y-3">
                  <Badge
                    className={clsx("text-white", getStatusColor(match.status))}
                  >
                    {getLabel(match.status, "status")}
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    {getLabel(match.gender_key, "genders")} •{" "}
                    {getLabel(match.age_key, "ages")} •{" "}
                    {getLabel(match.belt_key, "belts")} •{" "}
                    {getLabel(match.category_key, "categories")}
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                      <p className="text-2xl font-semibold leading-none">
                        {match.fighters?.[0]?.name}
                      </p>
                      <p className="text-lg text-muted-foreground">
                        {match.fighters?.[0]?.team}
                      </p>
                    </div>
                    <span className="text-2xl text-muted-foreground">vs</span>
                    <div className="flex flex-col">
                      <p className="text-2xl font-semibold leading-none">
                        {match.fighters?.[1]?.name}
                      </p>
                      <p className="text-lg text-muted-foreground">
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
                    {match.status !== "FINISHED" && (
                      <Link
                        href={`/protected/${match.id}/match`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <DropdownMenuItem asChild>
                          <span>Iniciar</span>
                        </DropdownMenuItem>
                      </Link>
                    )}
                    <Link
                      href={`/protected/${match.id}/live`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <DropdownMenuItem asChild>
                        <span>
                          {match.status !== "IN_PROGRESS"
                            ? "Visualizar"
                            : "Ao vivo"}
                        </span>
                      </DropdownMenuItem>
                    </Link>
                    {match.status === "PENDING" && (
                      <DeleteMatch
                        id={match.id}
                        fightersIds={match.fighters.map((f) => f.id)}
                      >
                        <span>Excluir</span>
                      </DeleteMatch>
                    )}
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
