import { useActionState } from "react"
import toast from "react-hot-toast"

import { createTodo } from "@/app/actions/todos"
import { todoSchema } from "@/schemas/todo"
import type { Todo } from "@/types/todo"

interface TodosFormProps {
  onUpdate: (newTodo: Todo) => void
}

const TodosForm = ({ onUpdate }: TodosFormProps) => {
  const [formState, formAction, isPending] = useActionState((_: unknown, formData: FormData) =>  {
    const data = Object.fromEntries(formData)
    
    const validatedData = todoSchema.omit({ id: true }).safeParse(data)

    if (!validatedData.success) {
      return {
        formData,
        fieldErrors: validatedData.error.flatten().fieldErrors,
      }
    }

    createTodo(validatedData.data).then((data) => {
      if ("error" in data) {
        toast.error(data.error)
      } else {
        onUpdate(data)
      }
    })
  }, {
    fieldErrors: {},
    formData: new FormData(),
  })

  return (
    <form action={formAction}>
      <div className="flex items-center gap-2">
        <input
          name="title"
          className="border-1 border-gray-300 rounded-md p-2 min-w-[250px]"
          type="text"
          placeholder="Add Todo"
          defaultValue={formState?.formData.get("title") as string || ""}
        />
        <button type="submit" className="bg-blue-500 text-white rounded-md p-2 w-1/2 cursor-pointer hover:opacity-85 transition-all ease-in duration-100" disabled={isPending}>
          Add Todo
        </button>
      </div>
      {formState?.fieldErrors?.title && <p className="text-red-500 mt-2">{formState.fieldErrors.title}</p>}
    </form>
  )
}

export default TodosForm