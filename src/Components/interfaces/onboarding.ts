// import { z } from "zod";

// export const OnboardingCustomerSchema = z.object({
//   code: z.string().min(1, "Code is required"),
//   name: z.string().min(1, "Name is required"),
//   address: z.string().min(1, "Address is required"),
//   city: z.string().min(1, "City is required"),
//   pincode: z.coerce.number().min(1, "Pincode is required"),
//   email: z.string().email("Invalid email"),
//   phone: z.string().regex(/^\d{10}$/, "Invalid phone number"),
//   pan: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN format"),
//   tan: z.string().regex(/^[A-Z]{4}[0-9]{5}[A-Z]{1}$/, "Invalid TAN format"),
//   gstin: z.string().regex(/^[A-Z0-9]{15}$/, "Invalid GSTN format"),
//   turnover: z.number().min(1, "Turnover is required"),
//   tds: z.string().min(1, "TDS is required"),
//   tcs: z.string().min(1, "TCS is required"),
//   status: z.enum(["Pending", "Approved", "Rejected"]).default("Pending"),
//   error: z.enum(["Error", "No Error"]).default("No Error"),
// });

// export const OnboardingVendorSchema = OnboardingCustomerSchema.extend({
//   msme: z.boolean(),
//   eInvoice: z.boolean(),
//   bankName: z.string().min(1, "Bank name is required"),
//   bankBranch: z.string().min(1, "Bank branch is required"),
//   bankAccountNo: z.string().min(1, "Bank account number is required"),
//   ifsc: z.string().min(1, "IFSC code is required"),
//   nature: z.string(),
//   paymentTerms: z.string().min(1, "Payment terms are required"),
//   cancelledCheque: z
//     .instanceof(File)
//     .optional()
//     .refine(
//       (file) => file === undefined || file.size < 1024 * 1024 * 5,
//       "File size should be less than 5MB"
//     ),
//   msmeFile: z
//     .instanceof(File)
//     .optional()
//     .refine(
//       (file) => file === undefined || file.size < 1024 * 1024 * 5,
//       "File size should be less than 5MB"
//     ),
// });

// // Note: No type exports needed in JS. If you need runtime type info, use .parse() or .safeParse() from Zod

import { z } from "zod";

export const OnboardingCustomerSchema = z.object({
  code: z.string().min(1, "Code is required"),
  name: z.string().min(1, "Name is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  pincode: z.coerce.number().min(1, "Pincode is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().regex(/^\d{10}$/, "Invalid phone number"),
  pan: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN format"),
  tan: z.string().regex(/^[A-Z]{4}[0-9]{5}[A-Z]{1}$/, "Invalid TAN format"),
  gstin: z.string().regex(/^[A-Z0-9]{15}$/, "Invalid GSTN format"),
  turnover: z.number().min(1, "Turnover is required"),
  tds: z.string().min(1, "TDS is required"),
  tcs: z.string().min(1, "TCS is required"),
  status: z.enum(["Pending", "Approved", "Rejected"]).default("Pending"),
  error: z.enum(["Error", "No Error"]).default("No Error"),
});

export const OnboardingVendorSchema = OnboardingCustomerSchema.extend({
  msme: z.boolean(),
  eInvoice: z.boolean(),
  bankName: z.string().min(1, "Bank name is required"),
  bankBranch: z.string().min(1, "Bank branch is required"),
  bankAccountNo: z.string().min(1, "Bank account number is required"),
  ifsc: z.string().min(1, "IFSC code is required"),
  nature: z.string(),
  paymentTerms: z.string().min(1, "Payment terms are required"),
  cancelledCheque: z
    .instanceof(File)
    .optional()
    .refine(
      (file) => file === undefined || file.size < 1024 * 1024 * 5,
      "File size should be less than 5MB"
    ),
  msmeFile: z
    .instanceof(File)
    .optional()
    .refine(
      (file) => file === undefined || file.size < 1024 * 1024 * 5,
      "File size should be less than 5MB"
    ),
});

export type OnboardingCustomer = z.infer<typeof OnboardingCustomerSchema>;
export type OnboardingVendor = z.infer<typeof OnboardingVendorSchema>;
