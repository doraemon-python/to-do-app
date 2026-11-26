import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { mockTodos } from '../data/mockTodos'
import { TodoList } from './TodoList'

const meta = {
  title: 'Components/TodoList',
  component: TodoList,
  tags: ['autodocs'],
  args: {
    todos: mockTodos.slice(0, 3),
    pendingIds: [],
    onToggle: fn(),
    onDelete: fn(),
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 720 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TodoList>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithCompleted: Story = {
  args: {
    todos: mockTodos,
  },
}

export const Pending: Story = {
  args: {
    pendingIds: [mockTodos[1].id],
  },
}
