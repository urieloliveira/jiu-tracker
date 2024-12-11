export const belts = [
  { key: "WHITE", label: "Branca" },
  { key: "BLUE", label: "Azul" },
  { key: "PURPLE", label: "Roxa" },
  { key: "BROWN", label: "Marrom" },
  { key: "BLACK", label: "Preta" },
];
export const categories = [
  { key: "FEATHER", label: "Pena" },
  { key: "LIGHT", label: "Leve" },
  { key: "MIDDLE", label: "Médio" },
  { key: "MEDIUM_HEAVY", label: "Meio-Pesado" },
  { key: "HEAVY", label: "Pesado" },
  { key: "SUPER_HEAVY", label: "Super-Pesado" },
  { key: "ULTRA_HEAVY", label: "Pesadíssimo" },
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

export const getLabel = (
  key: string,
  list: "belts" | "categories" | "genders" | "ages"
) => {
  const data = { belts, categories, genders, ages };
  return data[list].find((item) => item.key === key)?.label;
};
