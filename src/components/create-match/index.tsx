import {
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ages, belts, categories, genders } from "./data";
import { nanoid } from "nanoid";
import { createClient } from "@/utils/supabase/server";
import { SubmitButton } from "../submit-button";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export default function CreateMatch() {
  async function onSubmit(formData: FormData) {
    "use server";
    const supabase = await createClient();
    const values = {
      belt_key: formData.get("belt_key") as string,
      category_key: formData.get("category_key") as string,
      gender_key: formData.get("gender_key") as string,
      age_key: formData.get("age_key") as string,
      fighters: [
        {
          name: formData.get("fighters.0.name") as string,
          team: formData.get("fighters.0.team") as string,
        },
        {
          name: formData.get("fighters.1.name") as string,
          team: formData.get("fighters.1.team") as string,
        },
      ],
    };

    const fighters = [
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

    const match = {
      id: nanoid(),
      status: "PENDING",
      time: 0,
      belt_key: values.belt_key,
      category_key: values.category_key,
      gender_key: values.gender_key,
      age_key: values.age_key,
    };

    const matchFighters = fighters.map((fighter) => ({
      match_id: match.id,
      fighter_id: fighter.id,
      advantages: 0,
      points: 0,
      penalties: 0,
    }));

    let insertedFighterIds: string[] = [];
    let insertedMatchId: string | null = null;

    try {
      const { data: fightersInserted, error: fightersError } = await supabase
        .from("fighters")
        .insert(fighters)
        .select("id");

      if (fightersError) throw new Error("Erro ao inserir os lutadores");

      insertedFighterIds = fightersInserted.map(
        (fighter: { id: string }) => fighter.id
      );

      const { data: matchInserted, error: matchError } = await supabase
        .from("matches")
        .insert([match])
        .select("id");

      console.log(matchError);

      if (matchError) throw new Error("Erro ao inserir a luta");

      insertedMatchId = matchInserted[0].id;

      const { error: matchFightersError } = await supabase
        .from("match_fighters")
        .insert(matchFighters);

      if (matchFightersError)
        throw new Error("Erro ao inserir os lutadores na luta");

      console.log("Tudo inserido com sucesso");
      revalidatePath(`/protected`);
    } catch (err) {
      console.error(err);

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
    <form
      method="post"
      action={onSubmit as unknown as string}
      className="space-y-8"
    >
      <DialogHeader>
        <DialogTitle>Nova Luta</DialogTitle>
        <DialogDescription>
          Preencha os campos abaixo para criar uma nova luta.
        </DialogDescription>
      </DialogHeader>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-4">
          <Select name="belt_key">
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
          <Select name="category_key">
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
        </div>
        <div className="flex justify-between gap-4">
          <Select name="gender_key">
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
          <Select name="age_key">
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
        </div>
        <div className="flex flex-col gap-4">
          <Label htmlFor="fighter1" className="font-semibold">
            Atleta 1
          </Label>
          <Input placeholder="Nome" name="fighters.0.name" />
          <Input placeholder="Equipe" name="fighters.0.team" />
        </div>
        <div className="flex flex-col gap-4">
          <Label htmlFor="fighter2" className="font-semibold">
            Atleta 2
          </Label>
          <Input placeholder="Nome" name="fighters.1.name" />
          <Input placeholder="Equipe" name="fighters.1.team" />
        </div>
      </div>
      <DialogFooter>
        <SubmitButton pendingText="Criando..." type="submit">
          Criar Luta
        </SubmitButton>
      </DialogFooter>
    </form>
  );
}
