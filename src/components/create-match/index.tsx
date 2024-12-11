import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Form, FormControl, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Fighter, formSchema, FormValues, Match, MatchFighter } from "./schema";
import { ages, belts, categories, genders } from "./data";
import { nanoid } from "nanoid";
import { createClient } from "@/utils/supabase/client";

export default function CreateMatch() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fighters: [{ id: nanoid() }, { id: nanoid() }],
    },
  });

  async function onSubmit(values: FormValues) {
    const supabase = createClient();

    const fighters: Fighter[] = [
      {
        id: nanoid(),
        name: values.fighters[0].name,
        team: values.fighters[0].team,
      },
      {
        id: nanoid(),
        name: values.fighters[1].name,
        team: values.fighters[1].team,
      },
    ];

    const match: Match = {
      id: nanoid(),
      status: "PENDING",
      belt_key: values.belt_key,
      category_key: values.category_key,
      gender_key: values.gender_key,
      age_key: values.age_key,
    };

    const matchFighters: MatchFighter[] = fighters.map((fighter) => ({
      match_id: match.id,
      fighter_id: fighter.id,
      advantages: 0,
      points: 0,
      penalties: 0,
    }));

    let insertedFighterIds: string[] = [];
    let insertedMatchId: string | null = null;

    try {
      // Inserir os lutadores
      const { data: fightersInserted, error: fightersError } = await supabase
        .from("fighters")
        .insert(fighters)
        .select("id"); // Retorna os IDs inseridos

      if (fightersError) throw new Error("Erro ao inserir os lutadores");

      insertedFighterIds = fightersInserted.map(
        (fighter: { id: string }) => fighter.id
      );

      // Inserir a luta
      const { data: matchInserted, error: matchError } = await supabase
        .from("matches")
        .insert([match])
        .select("id"); // Retorna o ID inserido

      if (matchError) throw new Error("Erro ao inserir a luta");

      insertedMatchId = matchInserted[0].id;

      // Inserir a relação entre luta e lutadores
      const { error: matchFightersError } = await supabase
        .from("match_fighters")
        .insert(matchFighters);

      if (matchFightersError)
        throw new Error("Erro ao inserir os lutadores na luta");

      console.log("Tudo inserido com sucesso");
    } catch (err) {
      console.error(err.message);

      // Rollback manual: remover os registros inseridos
      if (insertedFighterIds.length > 0) {
        await supabase.from("fighters").delete().in("id", insertedFighterIds);
      }

      if (insertedMatchId) {
        await supabase.from("matches").delete().eq("id", insertedMatchId);
      }

      console.log("Rollback concluído");
    }
  }

  return (
    <DialogContent>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <DialogHeader>
            <DialogTitle>Nova Luta</DialogTitle>
            <DialogDescription>
              Preencha os campos abaixo para criar uma nova luta.
            </DialogDescription>
          </DialogHeader>
          <input type="hidden" {...form.register("id")} />
          <div className="flex flex-col gap-4">
            <div className="flex justify-between gap-4">
              <FormField
                control={form.control}
                name="belt_key"
                render={({ field }) => (
                  <FormControl>
                    <Select onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione a faixa" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Faixa</SelectLabel>
                          {belts.map((belt) => (
                            <SelectItem key={belt.key} value={belt.key}>
                              {belt.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                )}
              />
              <FormField
                control={form.control}
                name="category_key"
                render={({ field }) => (
                  <FormControl>
                    <Select onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione a categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Categoria</SelectLabel>
                          {categories.map((category) => (
                            <SelectItem key={category.key} value={category.key}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                )}
              />
            </div>
            <div className="flex justify-between gap-4">
              <FormField
                control={form.control}
                name="gender_key"
                render={({ field }) => (
                  <FormControl>
                    <Select onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione o gênero" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Gênero</SelectLabel>
                          {genders.map((gender) => (
                            <SelectItem key={gender.key} value={gender.key}>
                              {gender.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                )}
              />
              <FormField
                control={form.control}
                name="age_key"
                render={({ field }) => (
                  <FormControl>
                    <Select onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione a idade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Idade</SelectLabel>
                          {ages.map((age) => (
                            <SelectItem key={age.key} value={age.key}>
                              {age.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                )}
              />
            </div>
            <div className="flex flex-col gap-4">
              <Label htmlFor="fighter1" className="font-semibold">
                Atleta 1
              </Label>
              <FormField
                control={form.control}
                name="fighters.0.name"
                render={({ field }) => (
                  <FormControl>
                    <Input placeholder="Nome" {...field} />
                  </FormControl>
                )}
              />
              <FormField
                control={form.control}
                name="fighters.0.team"
                render={({ field }) => (
                  <FormControl>
                    <Input placeholder="Equipe" {...field} />
                  </FormControl>
                )}
              />
            </div>
            <div className="flex flex-col gap-4">
              <Label htmlFor="fighter2" className="font-semibold">
                Atleta 2
              </Label>
              <FormField
                control={form.control}
                name="fighters.1.name"
                render={({ field }) => (
                  <FormControl>
                    <Input placeholder="Nome" {...field} />
                  </FormControl>
                )}
              />
              <FormField
                control={form.control}
                name="fighters.1.team"
                render={({ field }) => (
                  <FormControl>
                    <Input placeholder="Equipe" {...field} />
                  </FormControl>
                )}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="submit">Criar Luta</Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
}
