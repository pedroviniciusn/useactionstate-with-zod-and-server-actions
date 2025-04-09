import type { z } from "zod";
import type { todoSchema } from "@/schemas/todo";

export type Todo = z.infer<typeof todoSchema>