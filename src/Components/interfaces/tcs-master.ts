import { z } from "zod";

export const tcsSchema = z.object({
  tcsRateId: z.string(),
  natureOfTransaction: z.string(),
  tcsRate: z.number().min(0).max(100),
  thresholdLimit: z.string(),
  applicableSection: z.string(),
  residencyStatus: z.string(),
  effectiveFrom: z.string(),
});

export type TCSRecord = z.infer<typeof tcsSchema>;
