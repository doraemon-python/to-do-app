import type { Todo } from '../types/todo'
import { CalendarIcon, CheckIcon, TrashIcon } from './icons'
import { PriorityBadge } from './PriorityBadge'

function formatDueDate(dueDate: string) {
  return dueDate.replaceAll('-', '/')
}

type TodoItemProps = {
  todo: Todo
  isPending: boolean
  onToggle: (todo: Todo) => void
  onDelete: (todo: Todo) => void
}

export function TodoItem({
  todo,
  isPending,
  onToggle,
  onDelete,
}: TodoItemProps) {
  return (
    <li
      className={`task-card${todo.completed ? ' is-completed' : ''}${
        isPending ? ' is-pending' : ''
      }`}
      aria-busy={isPending}
    >
      <label className="task-check">
        <input
          id={`todo-checkbox-${todo.id}`}
          className="task-checkbox"
          type="checkbox"
          checked={todo.completed}
          disabled={isPending}
          onChange={() => onToggle(todo)}
          aria-label={`${todo.title}を${
            todo.completed ? '未完了に戻す' : '完了にする'
          }`}
        />
        <span className="task-checkbox-visual" aria-hidden="true">
          <CheckIcon />
        </span>
        <span className="task-title">{todo.title}</span>
      </label>

      <div className="task-meta">
        {todo.dueDate && (
          <span className="due-date">
            <CalendarIcon />
            期限 {formatDueDate(todo.dueDate)}
          </span>
        )}
        <PriorityBadge priority={todo.priority} />
      </div>

      <button
        type="button"
        className="icon-button delete-button"
        onClick={() => onDelete(todo)}
        disabled={isPending}
        aria-label={`${todo.title}を削除`}
        title="削除"
      >
        <TrashIcon />
      </button>
    </li>
  )
}
