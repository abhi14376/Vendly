import { z } from "zod";

const envSchema = z.object({
  VITE_API_BASE_URL: z.string().default("/api/v1"),
  VITE_SUPABASE_ANON_KEY: z.string().optional(),
  VITE_SUPABASE_URL: z.string().url().optional(),
});

export const env = envSchema.parse({
  VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
  VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
});

export const isSupabaseConfigured = Boolean(env.VITE_SUPABASE_URL && env.VITE_SUPABASE_ANON_KEY);
