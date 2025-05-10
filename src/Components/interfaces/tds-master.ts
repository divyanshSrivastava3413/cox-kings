import { z } from "zod";

export const tdsSchema = z.object({
  tdsRateId: z.string(),
  natureOfPayment: z.string(),
  tdsRate: z.string(),
  thresholdLimit: z.string(),
  applicableSection: z.string(),
  residencyStatus: z.string(),
  effectiveFrom: z.string(),
});

export type TDSRecord = z.infer<typeof tdsSchema>;
