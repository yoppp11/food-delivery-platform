import z from "zod";

export const PaymentMethodEnum = [
  "all",
  "qris",
  "paypal",
  "cimb_niaga_va",
  "bni_va",
  "sampoerna_va",
  "bnc_va",
  "maybank_va",
  "permata_va",
  "atm_bersama_va",
  "artha_graha_va",
  "bri_va",
] as const;

export const PaymentMethodSchema = z.enum(PaymentMethodEnum);

export const CreatePaymentSchema = z.object({
//   amount: z.number().positive(),
  paymentMethod: PaymentMethodSchema,
});

export type CreatePayment = z.infer<typeof CreatePaymentSchema>;
export type PaymentMethod = z.infer<typeof PaymentMethodSchema>;
