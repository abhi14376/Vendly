import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const signupSchema = z
  .object({
    firstName: z.string().trim().min(1, "First name is required.").min(2, "First name must be at least 2 characters."),
    lastName: z.string().trim().min(1, "Last name is required.").min(2, "Last name must be at least 2 characters."),
    email: z.string().trim().min(1, "Email is required.").email("Please enter a valid email address."),
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string().min(1, "Please confirm your password."),
    role: z.enum(["lead", "vendor"], { required_error: "Please select a role." }),
    mobile: z
      .string()
      .trim()
      .min(1, "Mobile number is required.")
      .min(10, "Mobile number is mandatory and must be at least 10 digits.")
      .regex(/^[0-9+\s-]+$/, "Invalid mobile number format"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type SignupFormValues = z.infer<typeof signupSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
