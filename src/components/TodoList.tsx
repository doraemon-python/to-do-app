import type { Todo } from '../types/todo'
import { TodoItem } from './TodoItem'

type TodoListProps = {
  todos: Todo[]
  pendingIds: string[]
  onToggle: (todo: Todo) => void
  onDelete: (todo: Todo) => void
}

export function TodoList({
  todos,
  pendingIds,
  onToggle,
  onDelete,
}: TodoListProps) {
  return (
    <ul className="task-list">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isPending={pendingIds.includes(todo.id)}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </ul>
  )
}
