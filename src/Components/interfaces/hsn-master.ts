import { z } from "zod";

export const hsnSchema = z.object({
  hsnCodeId: z.string(),
  hsnCode: z.string(),
  description: z.string(),
  gstRate: z.number().min(0).max(100),
  exempted: z.boolean(),
  effectiveFrom: z.string(),
});

export type HSNRecord = z.infer<typeof hsnSchema>;
