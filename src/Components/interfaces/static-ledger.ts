import { z } from "zod";

export const ItemSchema: z.ZodSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  parentId: z.string().nullable(),
  superParentId: z.string(),
  children: z.array(z.lazy(() => ItemSchema)).default([]),
});

export type Item = z.infer<typeof ItemSchema>;

export const SuperParentSchema = z.object({
  id: z.string(),
  name: z.string(),
  items: z.array(ItemSchema).default([]),
});

export type SuperParent = z.infer<typeof SuperParentSchema>;

export type TableAction =
  | {
      type: "ADD_ITEM";
      payload: { superParentId: string; parentId: string | null; name: string };
    }
  | {
      type: "EDIT_ITEM";
      payload: { id: string; name: string; superParentId: string };
    }
  | {
      type: "DELETE_ITEM";
      payload: { id: string; superParentId: string };
    };

export const itemFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

export type ItemFormData = z.infer<typeof itemFormSchema>;
