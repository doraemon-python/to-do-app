import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { mockTodos } from '../data/mockTodos'
import { ConfirmDialog } from './ConfirmDialog'

const todo = mockTodos[1]

const meta = {
  title: 'Components/ConfirmDialog',
  component: ConfirmDialog,
  tags: ['autodocs'],
  args: {
    todo,
    isPending: false,
    onCancel: fn(),
    onConfirm: fn(),
  },
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof ConfirmDialog>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Pending: Story = {
  args: {
    isPending: true,
  },
}
