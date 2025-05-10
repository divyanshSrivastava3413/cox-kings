import { z } from "zod";

export const stateSchema = z.object({
  stateName: z.string(),
  isUnionTerritory: z.boolean(),
});

export type StateRecord = z.infer<typeof stateSchema>;
