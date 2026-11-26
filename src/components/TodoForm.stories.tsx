import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { TodoForm } from './TodoForm'

const meta = {
  title: 'Components/TodoForm',
  component: TodoForm,
  tags: ['autodocs'],
  args: {
    isSubmitting: false,
    onSubmit: async () => true,
    onClearError: fn(),
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 720 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TodoForm>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const ValidationError: Story = {
  args: {
    error: 'タイトルを入力してください',
  },
}

export const Submitting: Story = {
  args: {
    isSubmitting: true,
  },
}
