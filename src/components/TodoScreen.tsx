import { useEffect, useRef, useState } from 'react'
import type { CreateTodoInput, LoadStatus, Todo } from '../types/todo'
import { ConfirmDialog } from './ConfirmDialog'
import { EmptyState } from './EmptyState'
import { ErrorState } from './ErrorState'
import { CheckIcon, CloseIcon } from './icons'
import { LoadingState } from './LoadingState'
import { TodoForm } from './TodoForm'
import { TodoList } from './TodoList'

type TodoScreenProps = {
  todos: Todo[]
  status: LoadStatus
  loadError: string
  operationError: string
  isCreating: boolean
  pendingIds: string[]
  formError?: string
  onAdd: (input: CreateTodoInput) => Promise<boolean>
  onToggle: (todo: Todo) => Promise<void>
  onDelete: (id: string) => Promise<boolean>
  onRetry: () => void
  onDismissOperationError: () => void
  onClearFormError: () => void
}

export function TodoScreen({
  todos,
  status,
  loadError,
  operationError,
  isCreating,
  pendingIds,
  formError,
  onAdd,
  onToggle,
  onDelete,
  onRetry,
  onDismissOperationError,
  onClearFormError,
}: TodoScreenProps) {
  const [deleteTarget, setDeleteTarget] = useState<Todo | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const listHeadingRef = useRef<HTMLHeadingElement>(null)
  const focusHeadingAfterDelete = useRef(false)

  const incompleteTodos = todos.filter((todo) => !todo.completed)
  const completedTodos = todos.filter((todo) => todo.completed)

  useEffect(() => {
    if (!deleteTarget && focusHeadingAfterDelete.current) {
      focusHeadingAfterDelete.current = false
      listHeadingRef.current?.focus()
    }
  }, [deleteTarget])

  async function handleToggle(todo: Todo) {
    await onToggle(todo)
    requestAnimationFrame(() => {
      document.getElementById(`todo-checkbox-${todo.id}`)?.focus()
    })
  }

  async function handleConfirmDelete() {
    if (!deleteTarget) {
      return
    }

    setIsDeleting(true)
    const success = await onDelete(deleteTarget.id)
    setIsDeleting(false)

    if (success) {
      focusHeadingAfterDelete.current = true
    }

    setDeleteTarget(null)
  }

  return (
    <div className="app">
      <a className="skip-link" href="#main">
        本文へスキップ
      </a>

      <header className="app-header">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">
            <CheckIcon />
          </span>
          <div>
            <p className="brand-eyebrow">MY TASKS</p>
            <h1>ToDo</h1>
          </div>
        </div>

        {status === 'ready' && (
          <div className="stats" aria-live="polite">
            <span className="stat">
              <strong>{incompleteTodos.length}</strong>
              <span>残り</span>
            </span>
            <span className="stat stat-completed">
              <strong>{completedTodos.length}</strong>
              <span>完了</span>
            </span>
          </div>
        )}
      </header>

      <main id="main" tabIndex={-1}>
        {status === 'loading' && (
          <section className="panel" aria-label="読み込み中">
            <LoadingState />
          </section>
        )}

        {status === 'error' && (
          <section className="panel" aria-label="読み込みエラー">
            <ErrorState message={loadError} onRetry={onRetry} />
          </section>
        )}

        {status === 'ready' && (
          <>
            <section className="panel add-panel" aria-labelledby="add-heading">
              <div className="panel-heading">
                <div>
                  <p className="section-kicker">ADD A TASK</p>
                  <h2 id="add-heading">新しいタスク</h2>
                </div>
                <p className="panel-note">思いついたら、すぐに。</p>
              </div>

              <TodoForm
                isSubmitting={isCreating}
                error={formError}
                onSubmit={onAdd}
                onClearError={onClearFormError}
              />
            </section>

            <section
              id="tasks"
              className="panel tasks-panel"
              aria-labelledby="list-heading"
            >
              <div className="panel-heading">
                <div>
                  <p className="section-kicker">YOUR LIST</p>
                  <h2 id="list-heading" ref={listHeadingRef} tabIndex={-1}>
                    タスク
                  </h2>
                </div>
                <span className="list-count">{incompleteTodos.length} 件</span>
              </div>

              {operationError && (
                <div className="alert" role="alert">
                  <span>{operationError}</span>
                  <button
                    type="button"
                    className="alert-close"
                    onClick={onDismissOperationError}
                    aria-label="エラーメッセージを閉じる"
                  >
                    <CloseIcon />
                  </button>
                </div>
              )}

              {todos.length === 0 ? (
                <EmptyState />
              ) : (
                <>
                  {incompleteTodos.length > 0 ? (
                    <TodoList
                      todos={incompleteTodos}
                      pendingIds={pendingIds}
                      onToggle={handleToggle}
                      onDelete={setDeleteTarget}
                    />
                  ) : (
                    <p className="empty-inline">未完了のタスクはありません。</p>
                  )}

                  {completedTodos.length > 0 && (
                    <div className="completed-section">
                      <div className="completed-heading">
                        <h3>完了済み</h3>
                        <span>{completedTodos.length} 件</span>
                      </div>
                      <TodoList
                        todos={completedTodos}
                        pendingIds={pendingIds}
                        onToggle={handleToggle}
                        onDelete={setDeleteTarget}
                      />
                    </div>
                  )}
                </>
              )}
            </section>
          </>
        )}
      </main>

      {deleteTarget && (
        <ConfirmDialog
          todo={deleteTarget}
          isPending={isDeleting}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  )
}
