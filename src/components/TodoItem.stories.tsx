import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { mockTodos } from '../data/mockTodos'
import { TodoItem } from './TodoItem'

const baseTodo = mockTodos[0]

const meta = {
  title: 'Components/TodoItem',
  component: TodoItem,
  tags: ['autodocs'],
  args: {
    todo: baseTodo,
    isPending: false,
    onToggle: fn(),
    onDelete: fn(),
  },
  decorators: [
    (Story) => (
      <ul style={{ maxWidth: 720 }}>
        <Story />
      </ul>
    ),
  ],
} satisfies Meta<typeof TodoItem>

export default meta
type Story = StoryObj<typeof meta>

export const HighPriority: Story = {}

export const MediumPriority: Story = {
  args: {
    todo: { ...baseTodo, id: 'story-2', priority: 'medium' },
  },
}

export const LowPriority: Story = {
  args: {
    todo: { ...baseTodo, id: 'story-3', priority: 'low' },
  },
}

export const WithoutDueDate: Story = {
  args: {
    todo: { ...baseTodo, id: 'story-4', dueDate: null },
  },
}

export const Completed: Story = {
  args: {
    todo: {
      ...baseTodo,
      id: 'story-5',
      title: 'Amazon の返品手続き',
      completed: true,
    },
  },
}

export const LongTitle: Story = {
  args: {
    todo: {
      ...baseTodo,
      id: 'story-6',
      title:
        '来週の定例ミーティングで共有する四半期の進捗資料をまとめて、関係者全員に事前送付する',
    },
  },
}

export const Pending: Story = {
  args: {
    isPending: true,
  },
}
