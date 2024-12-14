export const belts = [
  { key: "WHITE", label: "Branca" },
  { key: "BLUE", label: "Azul" },
  { key: "PURPLE", label: "Roxa" },
  { key: "BROWN", label: "Marrom" },
  { key: "BLACK", label: "Preta" },
];
export const categories = [
  { key: "FEATHER", label: "Pena" },
  { key: "HEAVY", label: "Pesado" },
  { key: "LIGHT", label: "Leve" },
  { key: "MEDIUM_HEAVY", label: "Meio-Pesado" },
  { key: "MIDDLE", label: "Médio" },
  { key: "SUPER_HEAVY", label: "Super-Pesado" },
  { key: "ULTRA_HEAVY", label: "Pesadíssimo" },
  { key: "ABSOLUTE", label: "Absoluto" },
];
export const genders = [
  { key: "MALE", label: "Masculino" },
  { key: "FEMALE", label: "Feminino" },
];
export const ages = [
  { key: "KIDS", label: "Infantil" },
  { key: "JUVENILE", label: "Juvenil" },
  { key: "ADULT", label: "Adulto" },
  { key: "MASTER", label: "Master" },
];
export const status = [
  { key: "PENDING", label: "Pendente" },
  { key: "IN_PROGRESS", label: "Em andamento" },
  { key: "FINISHED", label: "Finalizado" },
];

export const getLabel = (
  key: string,
  list: "belts" | "categories" | "genders" | "ages" | "status"
) => {
  const data = { belts, categories, genders, ages, status };
  return data[list].find((item) => item.key === key)?.label;
};

export const getBeltColor = (key: string) => {
  const beltsColors = {
    WHITE: "bg-zinc-300",
    BLUE: "bg-blue-800",
    PURPLE: "bg-purple-800",
    BROWN: "bg-orange-900",
    BLACK: "bg-neutral-800",
  };
  return beltsColors[key as keyof typeof beltsColors];
};

export const getStatusColor = (key: string) => {
  const statusColors = {
    PENDING: "bg-yellow-600",
    IN_PROGRESS: "bg-green-800",
    FINISHED: "bg-neutral-600",
  };
  return statusColors[key as keyof typeof statusColors];
};
