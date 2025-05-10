import { z } from "zod";

const PartySchema = z.object({
  name: z.string(),
  address: z.string().min(1, "Address is required"),
  stateCode: z.string().min(1, "State code is required"),
  gstin: z.string().length(15, "GSTIN must be 15 characters long"),
});

const ItemSchema = z.object({
  name: z.string().min(1, "Item name is required"),
  description: z.string().min(1, "Description is required"),
  hsnSac: z.string().min(1, "HSN/SAC is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  uom: z.string().min(1, "UOM is required"),
  basicValue: z.number().min(0, "Basic value cannot be negative"),
  discount: z.number().min(0, "Discount cannot be negative"),
  taxableValue: z.number(),
  gstRate: z.number().min(0, "GST rate cannot be negative"),
  igst: z.number(),
  cgst: z.number(),
  sgst: z.number(),
  cess: z.number().min(0, "Cess cannot be negative"),
  total: z.number(),
});

export const PurchaseSchema = z.object({
  id: z.string().optional(),
  purchaseFrom: PartySchema,
  invoiceNumber: z.string().min(1, "Invoice number is required"),
  invoiceDate: z.string().min(1, "Invoice date is required"),
  placeOfSupply: z.string().min(1, "Place of supply is required"),
  reverseCharge: z.enum(["Yes", "No"]),
  items: z.array(ItemSchema).min(1, "At least one item is required"),
});

export type PurchaseData = z.infer<typeof PurchaseSchema>;
