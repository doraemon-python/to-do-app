import type { CreateTodoInput, Todo } from '../types/todo'
import { mockTodos } from './mockTodos'
import { TodoRepositoryError } from './todoRepository'
import type { TodoOperation, TodoRepository } from './todoRepository'

type MockTodoRepositoryOptions = {
  initialTodos?: Todo[]
  delayMs?: number
  failOn?: TodoOperation[]
}

function cloneTodo(todo: Todo): Todo {
  return { ...todo }
}

function createId() {
  if (typeof globalThis.crypto?.randomUUID === 'function') {
    return globalThis.crypto.randomUUID()
  }

  return `todo-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function createMockTodoRepository(
  options: MockTodoRepositoryOptions = {},
): TodoRepository {
  let todos = (options.initialTodos ?? mockTodos).map(cloneTodo)
  const delayMs = options.delayMs ?? 0
  const failOn = new Set(options.failOn ?? [])

  async function simulate(operation: TodoOperation) {
    if (delayMs > 0) {
      await wait(delayMs)
    }

    if (failOn.has(operation)) {
      throw new TodoRepositoryError(
        operation,
        `モックエラー: ${operation} に失敗しました`,
      )
    }
  }

  return {
    async list() {
      await simulate('list')
      return todos.map(cloneTodo)
    },

    async create(input: CreateTodoInput) {
      await simulate('create')

      const todo: Todo = {
        id: createId(),
        title: input.title,
        dueDate: input.dueDate,
        priority: input.priority,
        completed: false,
        createdAt: new Date().toISOString(),
      }

      todos = [todo, ...todos]
      return cloneTodo(todo)
    },

    async setCompleted(id: string, completed: boolean) {
      await simulate('setCompleted')

      const todo = todos.find((item) => item.id === id)

      if (!todo) {
        throw new TodoRepositoryError(
          'setCompleted',
          '対象のタスクが見つかりません',
        )
      }

      todo.completed = completed
      return cloneTodo(todo)
    },

    async remove(id: string) {
      await simulate('remove')

      if (!todos.some((item) => item.id === id)) {
        throw new TodoRepositoryError('remove', '対象のタスクが見つかりません')
      }

      todos = todos.filter((item) => item.id !== id)
    },
  }
}
