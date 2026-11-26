import { createMockTodoRepository } from './mockTodoRepository'
import { createMockTodos, mockTodos } from './mockTodos'
import type { TodoOperation, TodoRepository } from './todoRepository'

function parseNumber(value: string | null): number | undefined {
  if (!value) {
    return undefined
  }

  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined
}

function isTodoOperation(value: string): value is TodoOperation {
  return (
    value === 'list' ||
    value === 'create' ||
    value === 'setCompleted' ||
    value === 'remove'
  )
}

function parseFailOn(value: string | null): TodoOperation[] {
  if (!value) {
    return []
  }

  if (value === '1') {
    return ['list']
  }

  return value.split(',').filter(isTodoOperation)
}

export function createRepositoryFromUrl(
  search: string = window.location.search,
): TodoRepository {
  const params = new URLSearchParams(search)
  const count = parseNumber(params.get('mockCount'))
  const isEmpty = params.get('mockEmpty') === '1'
  const initialTodos = isEmpty
    ? []
    : count !== undefined
      ? createMockTodos(count)
      : mockTodos

  return createMockTodoRepository({
    initialTodos,
    delayMs: parseNumber(params.get('mockDelay')) ?? 250,
    failOn: parseFailOn(params.get('mockError')),
  })
}
