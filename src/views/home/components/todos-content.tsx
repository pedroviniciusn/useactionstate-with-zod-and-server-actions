import type { Todo } from "@/types/todo"

interface TodosContentProps {
  todos: Todo[],
  onLoading: boolean
}

const TodosContent = ({ todos, onLoading }: TodosContentProps) => {
  return (
    <div>
      {onLoading ? (
        <p>Loading...</p>
      ) : (
        todos.length === 0 ? (
          <p>No todos found</p>
        ) : (
          <ul className="list-disc pl-5">
            {todos.map((todo) => (
              <li key={todo.id} className="py-1">
                {todo.title}
              </li>
            ))}
          </ul>
        )
      )}
    </div>
  )
}

export default TodosContent