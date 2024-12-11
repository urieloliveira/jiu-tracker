import { z } from "zod";

export const fighterSchema = z.object({
  id: z.string(),
  name: z.string(),
  team: z.string(),
});

export type Fighter = z.infer<typeof fighterSchema>;

export const matchSchema = z.object({
  id: z.string(),
  status: z.string(),
  belt_key: z.enum(["WHITE", "BLUE", "PURPLE", "BROWN", "BLACK"]),
  category_key: z.enum([
    "FEATHER",
    "LIGHT",
    "MIDDLE",
    "MEDIUM_HEAVY",
    "HEAVY",
    "SUPER_HEAVY",
    "ULTRA_HEAVY",
  ]),
  gender_key: z.enum(["MALE", "FEMALE"]),
  age_key: z.enum(["CHILD", "JUVENILE", "ADULT", "MASTER"]),
});

export type Match = z.infer<typeof matchSchema>;

export const matchFighterSchema = z.object({
  match_id: z.string(),
  fighter_id: z.string(),
  advantages: z.number(),
  points: z.number(),
  penalties: z.number(),
  winner_by: z.string().optional(),
});

export type MatchFighter = z.infer<typeof matchFighterSchema>;

export const formSchema = matchSchema.extend({
  fighters: z.array(fighterSchema),
});

export type FormValues = z.infer<typeof formSchema>;
