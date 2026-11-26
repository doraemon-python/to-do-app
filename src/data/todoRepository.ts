import type { CreateTodoInput, Todo } from '../types/todo'

export type TodoOperation = 'list' | 'create' | 'setCompleted' | 'remove'

export class TodoRepositoryError extends Error {
  readonly operation: TodoOperation

  constructor(operation: TodoOperation, message: string) {
    super(message)
    this.name = 'TodoRepositoryError'
    this.operation = operation
  }
}

export interface TodoRepository {
  list(): Promise<Todo[]>
  create(input: CreateTodoInput): Promise<Todo>
  setCompleted(id: string, completed: boolean): Promise<Todo>
  remove(id: string): Promise<void>
}
