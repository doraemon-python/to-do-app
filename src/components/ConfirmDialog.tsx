import { useEffect, useId, useRef } from 'react'
import type { MouseEvent } from 'react'
import type { Todo } from '../types/todo'
import { AlertIcon } from './icons'

type ConfirmDialogProps = {
  todo: Todo
  isPending: boolean
  onCancel: () => void
  onConfirm: () => void
}

export function ConfirmDialog({
  todo,
  isPending,
  onCancel,
  onConfirm,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const cancelRef = useRef<HTMLButtonElement>(null)
  const titleId = useId()
  const descriptionId = useId()

  useEffect(() => {
    const previouslyFocused =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null

    cancelRef.current?.focus()

    return () => {
      previouslyFocused?.focus()
    }
  }, [])

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && !isPending) {
        event.preventDefault()
        onCancel()
        return
      }

      if (event.key !== 'Tab') {
        return
      }

      const dialog = dialogRef.current

      if (!dialog) {
        return
      }

      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])',
        ),
      )

      if (focusable.length === 0) {
        return
      }

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isPending, onCancel])

  function handleBackdropClick(event: MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget && !isPending) {
      onCancel()
    }
  }

  return (
    <div className="dialog-backdrop" onClick={handleBackdropClick}>
      <div
        ref={dialogRef}
        className="dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
      >
        <div className="dialog-icon" aria-hidden="true">
          <AlertIcon />
        </div>
        <h2 id={titleId}>タスクを削除しますか？</h2>
        <p id={descriptionId}>
          「{todo.title}」を削除します。この操作は取り消せません。
        </p>
        <div className="dialog-actions">
          <button
            ref={cancelRef}
            type="button"
            className="secondary-button"
            onClick={onCancel}
            disabled={isPending}
          >
            キャンセル
          </button>
          <button
            type="button"
            className="danger-button"
            onClick={onConfirm}
            disabled={isPending}
          >
            {isPending ? '削除中...' : '削除する'}
          </button>
        </div>
      </div>
    </div>
  )
}
