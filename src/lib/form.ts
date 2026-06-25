import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";

export function createFormResolver<TSchema extends z.ZodTypeAny>(schema: TSchema) {
  return zodResolver(schema);
}
