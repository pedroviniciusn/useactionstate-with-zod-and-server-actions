import { useEffect, useState } from "react"
import toast from "react-hot-toast"

import { getTodos } from "@/app/actions/todos"
import type { Todo } from "@/types/todo"

import TodosHeader from "./todos-header"
import TodosForm from "./todos-form"
import TodosContent from "./todos-content"

const Todos = () => {
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)

  const handleUpdateTodos = (newTodo: Todo) => {
    setTodos((prev) => [...prev, newTodo])
  }

  useEffect(() => {
    getTodos().then((data) => {
      if ('error' in data) {
        toast.error(data.error)
      } else {
        setTodos(data)
      }
    }).finally(() => setLoading(false))
  }, [])

  return (
    <div className="flex flex-col items-start gap-4 p-4 rounded-lg shadow-md">
      <TodosHeader />
      <TodosForm onUpdate={handleUpdateTodos} />
      <TodosContent todos={todos} onLoading={loading} />
    </div>
  )
}

export default Todos