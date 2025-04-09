import { z } from "zod";

export const todoSchema = z.object({
  id: z.string(),
  title: z.string().min(3, "Title should be at least 3 characters long"),
}).required();