export type Priority = 'high' | 'medium' | 'low'

export type Todo = {
  id: string
  title: string
  dueDate: string | null
  priority: Priority
  completed: boolean
  createdAt: string
}

export type CreateTodoInput = {
  title: string
  dueDate: string | null
  priority: Priority
}

export type LoadStatus = 'loading' | 'ready' | 'error'
