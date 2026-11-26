import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from './App'
import { createMockTodoRepository } from './data/mockTodoRepository'
import type { TodoRepository } from './data/todoRepository'
import type { Todo } from './types/todo'

const activeTodo: Todo = {
  id: 'test-1',
  title: '見積書を送付する',
  dueDate: '2026-11-14',
  priority: 'high',
  completed: false,
  createdAt: '2026-11-13T09:00:00+09:00',
}

const completedTodo: Todo = {
  id: 'test-2',
  title: 'Amazon の返品手続き',
  dueDate: null,
  priority: 'medium',
  completed: true,
  createdAt: '2026-11-13T09:05:00+09:00',
}

function renderApp(todos: Todo[] = [activeTodo, completedTodo]) {
  const repository = createMockTodoRepository({ initialTodos: todos })
  render(<App repository={repository} />)
  return repository
}

describe('App', () => {
  it('読み込み後に未完了と完了済みのタスクを表示する', async () => {
    renderApp()

    expect(screen.getByText('タスクを読み込んでいます...')).toBeInTheDocument()

    expect(
      await screen.findByRole('checkbox', {
        name: '見積書を送付するを完了にする',
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('checkbox', {
        name: 'Amazon の返品手続きを未完了に戻す',
      }),
    ).toBeInTheDocument()
    expect(screen.getByText('完了済み')).toBeInTheDocument()
    expect(screen.getByText('期限 2026/11/14')).toBeInTheDocument()
  })

  it('タイトル・期限・優先度を指定してタスクを追加できる', async () => {
    const user = userEvent.setup()
    renderApp()

    await screen.findByRole('checkbox', {
      name: '見積書を送付するを完了にする',
    })

    await user.type(screen.getByLabelText('タイトル'), '請求書を確認する')
    fireEvent.change(screen.getByLabelText('期限'), {
      target: { value: '2026-11-20' },
    })
    await user.click(screen.getByRole('radio', { name: '高' }))
    await user.click(screen.getByRole('button', { name: '追加' }))

    const checkbox = await screen.findByRole('checkbox', {
      name: '請求書を確認するを完了にする',
    })
    const card = checkbox.closest('li')

    expect(card).not.toBeNull()
    expect(
      within(card as HTMLElement).getByText('期限 2026/11/20'),
    ).toBeInTheDocument()
    expect(within(card as HTMLElement).getByText('高')).toBeInTheDocument()
    expect(screen.getByLabelText('タイトル')).toHaveValue('')
    expect(screen.getByLabelText('期限')).toHaveValue('')
    expect(screen.getByRole('radio', { name: '中' })).toBeChecked()
  })

  it('タイトルが空の場合はエラーを表示し、タスクを追加しない', async () => {
    const user = userEvent.setup()
    renderApp([])

    await screen.findByRole('heading', { name: 'タスクはまだありません' })

    await user.click(screen.getByRole('button', { name: '追加' }))

    expect(screen.getByRole('alert')).toHaveTextContent(
      'タイトルを入力してください',
    )
    expect(screen.getByLabelText('タイトル')).toHaveFocus()
    expect(screen.getByLabelText('タイトル')).toHaveAttribute(
      'aria-invalid',
      'true',
    )
  })

  it('完了を切り替えると完了済みセクションに移動し、元に戻せる', async () => {
    const user = userEvent.setup()
    renderApp([activeTodo])

    const checkbox = await screen.findByRole('checkbox', {
      name: '見積書を送付するを完了にする',
    })
    await user.click(checkbox)

    const returnCheckbox = await screen.findByRole('checkbox', {
      name: '見積書を送付するを未完了に戻す',
    })
    expect(screen.getByText('完了済み')).toBeInTheDocument()
    expect(returnCheckbox).toBeChecked()

    await user.click(returnCheckbox)

    await waitFor(() => {
      expect(screen.queryByText('完了済み')).not.toBeInTheDocument()
    })
    expect(
      screen.getByRole('checkbox', {
        name: '見積書を送付するを完了にする',
      }),
    ).not.toBeChecked()
  })

  it('削除はキャンセルでき、確定するとタスクが消える', async () => {
    const user = userEvent.setup()
    renderApp([activeTodo])

    await screen.findByText('見積書を送付する')

    await user.click(
      screen.getByRole('button', { name: '見積書を送付するを削除' }),
    )
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByRole('dialog').textContent).toContain('見積書を送付する')

    await user.click(screen.getByRole('button', { name: 'キャンセル' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByText('見積書を送付する')).toBeInTheDocument()

    await user.click(
      screen.getByRole('button', { name: '見積書を送付するを削除' }),
    )
    await user.click(screen.getByRole('button', { name: '削除する' }))

    await waitFor(() => {
      expect(screen.queryByText('見積書を送付する')).not.toBeInTheDocument()
    })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'タスク' })).toHaveFocus()
    })
  })

  it('Escape キーで削除ダイアログを閉じる', async () => {
    const user = userEvent.setup()
    renderApp([activeTodo])

    await screen.findByText('見積書を送付する')
    await user.click(
      screen.getByRole('button', { name: '見積書を送付するを削除' }),
    )

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByText('見積書を送付する')).toBeInTheDocument()
  })

  it('読み込みエラーを表示し、再読み込みできる', async () => {
    const user = userEvent.setup()
    let listCalls = 0

    const repository: TodoRepository = {
      async list() {
        listCalls += 1

        if (listCalls === 1) {
          throw new Error('読み込み失敗')
        }

        return []
      },
      async create() {
        throw new Error('未使用')
      },
      async setCompleted() {
        throw new Error('未使用')
      },
      async remove() {
        throw new Error('未使用')
      },
    }

    render(<App repository={repository} />)

    expect(
      await screen.findByText('読み込みに失敗しました'),
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        'タスクを読み込めませんでした。再読み込みしてください。',
      ),
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: '再読み込み' }))

    expect(
      await screen.findByRole('heading', { name: 'タスクはまだありません' }),
    ).toBeInTheDocument()
    expect(listCalls).toBe(2)
  })

  it('追加に失敗した場合は操作エラーを表示する', async () => {
    const user = userEvent.setup()
    const repository = createMockTodoRepository({
      initialTodos: [],
      failOn: ['create'],
    })

    render(<App repository={repository} />)

    await screen.findByRole('heading', { name: 'タスクはまだありません' })

    await user.type(screen.getByLabelText('タイトル'), '失敗するタスク')
    await user.click(screen.getByRole('button', { name: '追加' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'タスクを追加できませんでした。時間をおいてもう一度お試しください。',
    )
    expect(screen.getByLabelText('タイトル')).toHaveValue('失敗するタスク')
  })
})
