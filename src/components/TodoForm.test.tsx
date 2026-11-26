import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { TodoForm } from './TodoForm'

describe('TodoForm', () => {
  it('入力内容を送信し、成功後にフォームをリセットする', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn(async () => true)

    render(
      <TodoForm
        isSubmitting={false}
        onSubmit={onSubmit}
        onClearError={vi.fn()}
      />,
    )

    await user.type(screen.getByLabelText('タイトル'), '請求書を確認する')
    fireEvent.change(screen.getByLabelText('期限'), {
      target: { value: '2026-11-20' },
    })
    await user.click(screen.getByRole('radio', { name: '高' }))
    await user.click(screen.getByRole('button', { name: '追加' }))

    expect(onSubmit).toHaveBeenCalledWith({
      title: '請求書を確認する',
      dueDate: '2026-11-20',
      priority: 'high',
    })
    expect(screen.getByLabelText('タイトル')).toHaveValue('')
    expect(screen.getByLabelText('期限')).toHaveValue('')
    expect(screen.getByRole('radio', { name: '中' })).toBeChecked()
    expect(screen.getByLabelText('タイトル')).toHaveFocus()
  })

  it('送信に失敗した場合は入力を保持する', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn(async () => false)

    render(
      <TodoForm
        isSubmitting={false}
        onSubmit={onSubmit}
        onClearError={vi.fn()}
      />,
    )

    await user.type(screen.getByLabelText('タイトル'), '失敗するタスク')
    await user.click(screen.getByRole('button', { name: '追加' }))

    expect(screen.getByLabelText('タイトル')).toHaveValue('失敗するタスク')
  })

  it('エラーを表示し、タイトルを入力するとクリアを通知する', async () => {
    const user = userEvent.setup()
    const onClearError = vi.fn()

    render(
      <TodoForm
        isSubmitting={false}
        error="タイトルを入力してください"
        onSubmit={vi.fn(async () => false)}
        onClearError={onClearError}
      />,
    )

    expect(screen.getByRole('alert')).toHaveTextContent(
      'タイトルを入力してください',
    )
    expect(screen.getByLabelText('タイトル')).toHaveFocus()

    await user.type(screen.getByLabelText('タイトル'), 'あ')

    expect(onClearError).toHaveBeenCalled()
  })

  it('送信中は追加ボタンを無効化し、進行中の表示にする', () => {
    render(
      <TodoForm
        isSubmitting
        onSubmit={vi.fn(async () => true)}
        onClearError={vi.fn()}
      />,
    )

    expect(screen.getByRole('button', { name: '追加中...' })).toBeDisabled()
  })
})
