'use server'
import { todoSchema } from "@/schemas/todo"
import type { Todo } from "@/types/todo"
import type { z } from "zod"

export type ICreateTodo = Omit<z.infer<typeof todoSchema>, "id">

export async function getTodos(): Promise<Todo[] | { error: string }> {
  try {
    const url = new URL(process.env.API_URL as string)

    url.pathname = "/todos"
  
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
  
    if (!response.ok) {
      return {
        error: 'Failed to fetch todos',
      }
    }
  
    const todos = await response.json()
    
    return todos
  } catch {
    return {
      error: 'Something went wrong',
    }
  }
}

export async function createTodo(data: ICreateTodo): Promise<Todo | { error: string }> {
  try {
    const url = new URL(process.env.API_URL as string)

    url.pathname = "/todos"
  
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
  
    if (!response.ok) {
      return {
        error: 'Failed to create todo',
      }
    }
  
    const todo = await response.json()
    
    return todo
  } catch {
    return {
      error: 'Something went wrong',
    }
  }
}
