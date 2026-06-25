export function logRecoverableError(error: unknown, context: string) {
  if (import.meta.env.DEV) {
    console.error(`[Vendly] ${context}`, error);
  }
}
