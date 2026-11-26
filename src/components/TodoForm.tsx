import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import {
  DEFAULT_PRIORITY,
  PRIORITY_LABELS,
  PRIORITY_ORDER,
} from '../constants/priority'
import type { CreateTodoInput, Priority } from '../types/todo'
import { PlusIcon } from './icons'

type TodoFormProps = {
  isSubmitting: boolean
  error?: string
  onSubmit: (input: CreateTodoInput) => Promise<boolean>
  onClearError: () => void
}

export function TodoForm({
  isSubmitting,
  error,
  onSubmit,
  onClearError,
}: TodoFormProps) {
  const [title, setTitle] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [priority, setPriority] = useState<Priority>(DEFAULT_PRIORITY)
  const titleRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (error) {
      titleRef.current?.focus()
    }
  }, [error])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const success = await onSubmit({
      title,
      dueDate: dueDate || null,
      priority,
    })

    if (success) {
      setTitle('')
      setDueDate('')
      setPriority(DEFAULT_PRIORITY)
      titleRef.current?.focus()
    }
  }

  function handleTitleChange(value: string) {
    setTitle(value)

    if (error) {
      onClearError()
    }
  }

  return (
    <form className="todo-form" onSubmit={handleSubmit} noValidate>
      <div className="form-title-row">
        <label className="field-label" htmlFor="todo-title">
          タイトル
        </label>
        <input
          ref={titleRef}
          id="todo-title"
          className={`text-input${error ? ' has-error' : ''}`}
          type="text"
          value={title}
          onChange={(event) => handleTitleChange(event.target.value)}
          placeholder="例: 見積書を送付する"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? 'todo-title-error' : undefined}
        />
        {error && (
          <p id="todo-title-error" className="field-error" role="alert">
            {error}
          </p>
        )}
      </div>

      <div className="form-meta-row">
        <div className="field field-date">
          <label className="field-label" htmlFor="todo-due-date">
            期限
          </label>
          <input
            id="todo-due-date"
            className="text-input"
            type="date"
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
          />
        </div>

        <fieldset className="field priority-field">
          <legend className="field-label">優先度</legend>
          <div className="priority-options">
            {PRIORITY_ORDER.map((value) => (
              <label
                key={value}
                className={`priority-option priority-option-${value}`}
              >
                <input
                  type="radio"
                  name="todo-priority"
                  value={value}
                  checked={priority === value}
                  onChange={() => setPriority(value)}
                />
                <span className="priority-option-dot" aria-hidden="true" />
                <span>{PRIORITY_LABELS[value]}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <button
          type="submit"
          className="primary-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            '追加中...'
          ) : (
            <>
              <PlusIcon />
              追加
            </>
          )}
        </button>
      </div>
    </form>
  )
}
