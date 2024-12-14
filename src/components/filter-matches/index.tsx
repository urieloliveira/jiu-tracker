"use client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ages, belts, categories, genders, status } from "../create-match/data";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useRef } from "react";

export default function FilterMatches() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const params = new URLSearchParams();
    const entries = Array.from(formData.entries());

    entries.forEach(([key, value]) => {
      if (value && typeof value === "string" && value !== "all") {
        params.append(key, value);
      }
    });
    router.push(`/protected?${params.toString()}`);
  };

  const handleReset = () => {
    if (formRef.current) {
      formRef.current.reset();
      const selects = formRef.current.querySelectorAll("select");
      selects.forEach((select) => {
        select.value = "all";
      });
    }
    router.push("/protected");
  };

  return (
    <form
      className="flex-1 flex justify-between items-center flex-wrap gap-4 flex-col md:flex-row"
      onSubmit={handleSubmit}
      ref={formRef}
    >
      <Select name="belt_key">
        <SelectTrigger className="flex-1">
          <SelectValue placeholder="Faixa" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Faixa</SelectLabel>
            <SelectItem value="all">Todas as Faixa</SelectItem>
            {belts.map((belt) => (
              <SelectItem key={belt.key} value={belt.key}>
                {belt.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Select name="category_key">
        <SelectTrigger className="flex-1">
          <SelectValue placeholder="Categoria" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Categoria</SelectLabel>
            <SelectItem value="all">Todas as Categorias</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.key} value={category.key}>
                {category.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Select name="gender_key">
        <SelectTrigger className="flex-1">
          <SelectValue placeholder="Gênero" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Gênero</SelectLabel>
            <SelectItem value="all">Todas as Generos</SelectItem>
            {genders.map((gender) => (
              <SelectItem key={gender.key} value={gender.key}>
                {gender.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Select name="age_key">
        <SelectTrigger className="flex-1">
          <SelectValue placeholder="Idade" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Idade</SelectLabel>
            <SelectItem value="all">Todas as idades</SelectItem>
            {ages.map((age) => (
              <SelectItem key={age.key} value={age.key}>
                {age.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Select name="status">
        <SelectTrigger className="flex-1">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Status</SelectLabel>
            <SelectItem value="all">Todas as lutas</SelectItem>
            {status.map((s) => (
              <SelectItem key={s.key} value={s.key}>
                {s.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <div className="flex-1 w-full flex gap-4">
        <Button type="reset" variant="ghost" onClick={handleReset}>
          Limpar
        </Button>
        <Button type="submit" variant="secondary">
          Filtrar
        </Button>
      </div>
    </form>
  );
}
