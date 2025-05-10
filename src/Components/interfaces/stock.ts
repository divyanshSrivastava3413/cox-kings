import { z } from "zod";

export const StockItemSchema = z
  .object({
    type: z.enum(["Goods", "Services"], { required_error: "Type is required" }),
    code: z.string().min(1, { message: "Item Code is required" }),
    name: z.string().min(1, { message: "Item Name is required" }),
    hsn: z.string().min(1, { message: "HSN / SAC is required" }),
    uom: z.string().optional(),
    tcsTaxCode: z.string().min(1, { message: "TCS Tax Code is required" }),
    gstTaxCode: z.string().min(1, { message: "GST Tax Code is required" }),
    tdsTaxCode: z.string().optional(),
    quantity: z
      .number()
      .min(0, { message: "Discount must be a non-negative number" }),
    stockIn: z.number().optional(),
    stockOut: z.number().optional(),
    initial: z.number().optional(),
    amount: z.number(),
    amountUpdated: z.number().optional(),
    closingAmount: z.number().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.type === "Goods" && !data.uom) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["uom"],
        message: "UOM is required when type is Goods",
      });
    }
    if (data.type === "Services" && !data.tdsTaxCode) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["tdsTaxCode"],
        message: "TDS Tax Code is required when type is Services",
      });
    }
  });

export const StockItemsSchema = z.object({
  items: z.array(StockItemSchema),
});

export type StockItem = z.infer<typeof StockItemSchema>;
export type StockItems = z.infer<typeof StockItemsSchema>;
