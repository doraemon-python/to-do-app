import { PRIORITY_ORDER } from '../constants/priority'
import type { Todo } from '../types/todo'

export const mockTodos: Todo[] = [
  {
    id: 'mock-1',
    title: '見積書を送付する',
    dueDate: '2026-11-14',
    priority: 'high',
    completed: false,
    createdAt: '2026-11-13T09:00:00+09:00',
  },
  {
    id: 'mock-2',
    title: '週次ミーティングの資料を準備する',
    dueDate: '2026-11-16',
    priority: 'medium',
    completed: false,
    createdAt: '2026-11-13T09:05:00+09:00',
  },
  {
    id: 'mock-3',
    title: '歯医者の予約を取る',
    dueDate: '2026-11-10',
    priority: 'low',
    completed: false,
    createdAt: '2026-11-13T09:10:00+09:00',
  },
  {
    id: 'mock-4',
    title: 'Amazon の返品手続き',
    dueDate: '2026-11-12',
    priority: 'medium',
    completed: true,
    createdAt: '2026-11-13T09:15:00+09:00',
  },
]

export function createMockTodos(count: number): Todo[] {
  return Array.from({ length: count }, (_, index) => {
    const day = String((index % 28) + 1).padStart(2, '0')

    return {
      id: `mock-${index + 1}`,
      title: `サンプルタスク ${index + 1}`,
      dueDate: index % 4 === 0 ? null : `2026-11-${day}`,
      priority: PRIORITY_ORDER[index % PRIORITY_ORDER.length],
      completed: index % 5 === 0,
      createdAt: '2026-11-13T09:00:00+09:00',
    }
  })
}
