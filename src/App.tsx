import { useCallback, useEffect, useState } from 'react'
import { TodoScreen } from './components/TodoScreen'
import type { TodoRepository } from './data/todoRepository'
import type { CreateTodoInput, LoadStatus, Todo } from './types/todo'
import './App.css'

type AppProps = {
  repository: TodoRepository
}

export default function App({ repository }: AppProps) {
  const [todos, setTodos] = useState<Todo[]>([])
  const [status, setStatus] = useState<LoadStatus>('loading')
  const [loadError, setLoadError] = useState('')
  const [operationError, setOperationError] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [pendingIds, setPendingIds] = useState<string[]>([])
  const [formError, setFormError] = useState<string>()
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let cancelled = false

    repository
      .list()
      .then((items) => {
        if (cancelled) {
          return
        }

        setTodos(items)
        setStatus('ready')
      })
      .catch(() => {
        if (cancelled) {
          return
        }

        setStatus('error')
        setLoadError('タスクを読み込めませんでした。再読み込みしてください。')
      })

    return () => {
      cancelled = true
    }
  }, [repository, reloadKey])

  const handleRetry = useCallback(() => {
    setStatus('loading')
    setLoadError('')
    setReloadKey((key) => key + 1)
  }, [])

  const handleAdd = useCallback(
    async (input: CreateTodoInput) => {
      if (!input.title.trim()) {
        setFormError('タイトルを入力してください')
        return false
      }

      setFormError(undefined)
      setIsCreating(true)
      setOperationError('')

      try {
        const todo = await repository.create({
          ...input,
          title: input.title.trim(),
        })

        setTodos((current) => [todo, ...current])
        setStatus('ready')
        return true
      } catch {
        setOperationError(
          'タスクを追加できませんでした。時間をおいてもう一度お試しください。',
        )
        return false
      } finally {
        setIsCreating(false)
      }
    },
    [repository],
  )

  const handleToggle = useCallback(
    async (todo: Todo) => {
      setPendingIds((current) => [...current, todo.id])
      setOperationError('')

      try {
        const updated = await repository.setCompleted(todo.id, !todo.completed)

        setTodos((current) =>
          current.map((item) => (item.id === updated.id ? updated : item)),
        )
      } catch {
        setOperationError(
          'タスクの状態を変更できませんでした。時間をおいてもう一度お試しください。',
        )
      } finally {
        setPendingIds((current) =>
          current.filter((pendingId) => pendingId !== todo.id),
        )
      }
    },
    [repository],
  )

  const handleDelete = useCallback(
    async (id: string) => {
      setPendingIds((current) => [...current, id])
      setOperationError('')

      try {
        await repository.remove(id)
        setTodos((current) => current.filter((item) => item.id !== id))
        return true
      } catch {
        setOperationError(
          'タスクを削除できませんでした。時間をおいてもう一度お試しください。',
        )
        return false
      } finally {
        setPendingIds((current) =>
          current.filter((pendingId) => pendingId !== id),
        )
      }
    },
    [repository],
  )

  return (
    <TodoScreen
      todos={todos}
      status={status}
      loadError={loadError}
      operationError={operationError}
      isCreating={isCreating}
      pendingIds={pendingIds}
      formError={formError}
      onAdd={handleAdd}
      onToggle={handleToggle}
      onDelete={handleDelete}
      onRetry={handleRetry}
      onDismissOperationError={() => setOperationError('')}
      onClearFormError={() => setFormError(undefined)}
    />
  )
}
