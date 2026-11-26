import type { Priority } from '../types/todo'

export const PRIORITY_ORDER: readonly Priority[] = ['high', 'medium', 'low']

export const DEFAULT_PRIORITY: Priority = 'medium'

export const PRIORITY_LABELS: Record<Priority, string> = {
  high: '高',
  medium: '中',
  low: '低',
}
