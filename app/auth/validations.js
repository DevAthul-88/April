import { z } from "zod"
export const email = z
  .string()
  .email()
  .transform((str) => str.toLowerCase().trim())
export const password = z
  .string()
  .min(10)
  .max(100)
  .transform((str) => str.trim())
export const name = z.string()

export const Signup = z.object({
  email,
  password,
  name,
  address: z.string(),
  company: z.string(),
})
export const Login = z.object({
  email,
  password: z.string(),
})
export const ForgotPassword = z.object({
  email,
})
export const ResetPassword = z
  .object({
    password: password,
    passwordConfirmation: password,
    token: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords don't match",
    path: ["passwordConfirmation"], // set the path of the error
  })
export const ChangePassword = z.object({
  currentPassword: z.string(),
  newPassword: password,
})
export const Contact = z
  .object({
    name: z.string(),
    email: z
      .string()
      .email()
      .transform((str) => str.toLowerCase().trim()),
    gender: z.string(),
    note: z.string(),
    userId: z.string(),
    client: z.string(),
    phone: z.string().nullable(),
    address: z.string().nullable(),
    company: z.string().nullable(),
    website: z.string().nullable(),
  })
  .strict()

export const Client = z
  .object({
    name: z.string(),
    email: z
      .string()
      .email()
      .transform((str) => str.toLowerCase().trim()),
    gender: z.string(),
    note: z.string(),
    userId: z.string(),
    country: z.string(),
    phone: z.string().nullable(),
    address: z.string().nullable(),
    company: z.string().nullable(),
    website: z.string().nullable(),
  })
  .strict()
export const Invoice = z.object({
  project: z.string(),
  client: z.string(),
  userId: z.string(),
  issue: z.string(),
  due: z.string(),
  tax: z.number(),
  discount: z.number(),
  note: z.string(),
  currency: z.string(),
  meta: z.array(
    z.object({
      details: z.string(),
      quantity: z.string(),
      price: z.string(),
    })
  ),
})
export const Project = z
  .object({
    name: z.string(),
    note: z.string(),
    userId: z.string(),
    start: z.string(),
    status: z.string(),
  })
  .strict()
export const Expense = z
  .object({
    userId: z.string(),
    name: z.string(),
    currency: z.string(),
    client: z.string(),
    note: z.string(),
    project: z.string(),
    amount: z.number(),
    date: z.string(),
    paid: z.boolean().nullable(),
    should: z.boolean().nullable(),
  })
  .strict()
export const Mail = z
  .object({
    userId: z.string(),
    name: z.string(),
    client: z.string(),
    note: z.string(),
    sender: z.string(),
    seen: z.boolean().nullable(),
  })
  .strict()
export const Payment = z
  .object({
    userId: z.string(),
    date: z.string(),
    method: z.string(),
    invoiceId: z.string(),
    amount: z.number(),
    currency: z.string(),
    ref: z.string(),
  })
  .strict()
