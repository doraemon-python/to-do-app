import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { createMockTodos, mockTodos } from '../data/mockTodos'
import { TodoScreen } from './TodoScreen'

const baseTodos = mockTodos

const meta = {
  title: 'Screens/TodoScreen',
  component: TodoScreen,
  tags: ['autodocs'],
  args: {
    todos: baseTodos,
    status: 'ready',
    loadError: '',
    operationError: '',
    isCreating: false,
    pendingIds: [],
    onAdd: async () => true,
    onToggle: async () => undefined,
    onDelete: async () => true,
    onRetry: fn(),
    onDismissOperationError: fn(),
    onClearFormError: fn(),
  },
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof TodoScreen>

export default meta
type Story = StoryObj<typeof meta>

export const Ready: Story = {}

export const Loading: Story = {
  args: {
    todos: [],
    status: 'loading',
  },
}

export const LoadError: Story = {
  args: {
    todos: [],
    status: 'error',
    loadError: 'タスクを読み込めませんでした。再読み込みしてください。',
  },
}

export const Empty: Story = {
  args: {
    todos: [],
  },
}

export const CompletedOnly: Story = {
  args: {
    todos: baseTodos.filter((todo) => todo.completed),
  },
}

export const ManyItems: Story = {
  args: {
    todos: createMockTodos(12),
  },
}

export const LongTitles: Story = {
  args: {
    todos: [
      {
        ...baseTodos[0],
        id: 'long-1',
        title:
          '来週の定例ミーティングで共有する四半期の進捗資料をまとめて、関係者全員に事前送付する',
      },
      {
        ...baseTodos[1],
        id: 'long-2',
        title:
          '新しいプロジェクトのキックオフに向けて、関係各所とのスケジュール調整と議事録の準備を行う',
      },
    ],
  },
}

export const OperationError: Story = {
  args: {
    operationError:
      'タスクの状態を変更できませんでした。時間をおいてもう一度お試しください。',
  },
}

export const FormError: Story = {
  args: {
    formError: 'タイトルを入力してください',
  },
}

export const Creating: Story = {
  args: {
    isCreating: true,
  },
}

export const PendingItem: Story = {
  args: {
    pendingIds: [baseTodos[1].id],
  },
}
