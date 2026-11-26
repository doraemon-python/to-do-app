import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { run } from 'axe-core'
import { describe, expect, it } from 'vitest'
import App from '../App'
import { createMockTodoRepository } from '../data/mockTodoRepository'
import type { Todo } from '../types/todo'

const todos: Todo[] = [
  {
    id: 'a11y-1',
    title: '見積書を送付する',
    dueDate: '2026-11-14',
    priority: 'high',
    completed: false,
    createdAt: '2026-11-13T09:00:00+09:00',
  },
  {
    id: 'a11y-2',
    title: '歯医者の予約を取る',
    dueDate: null,
    priority: 'low',
    completed: false,
    createdAt: '2026-11-13T09:05:00+09:00',
  },
  {
    id: 'a11y-3',
    title: 'Amazon の返品手続き',
    dueDate: '2026-11-12',
    priority: 'medium',
    completed: true,
    createdAt: '2026-11-13T09:10:00+09:00',
  },
]

async function expectNoViolations(container: HTMLElement) {
  const results = await run(container, {
    rules: {
      // jsdom は canvas を実装していないため、コントラストは手動で確認する
      'color-contrast': { enabled: false },
    },
  })

  expect(results.violations).toEqual([])
}

describe('アクセシビリティ', () => {
  it('タスク一覧画面に axe の違反がない', async () => {
    const { container } = render(
      <App repository={createMockTodoRepository({ initialTodos: todos })} />,
    )

    await screen.findByRole('checkbox', {
      name: '見積書を送付するを完了にする',
    })

    await expectNoViolations(container)
  })

  it('削除ダイアログに axe の違反がない', async () => {
    const user = userEvent.setup()
    const { container } = render(
      <App repository={createMockTodoRepository({ initialTodos: todos })} />,
    )

    await screen.findByText('見積書を送付する')
    await user.click(
      screen.getByRole('button', { name: '見積書を送付するを削除' }),
    )

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    await expectNoViolations(container)
  })
})
