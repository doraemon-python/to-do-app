import { PRIORITY_LABELS } from '../constants/priority'
import type { Priority } from '../types/todo'

type PriorityBadgeProps = {
  priority: Priority
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  return (
    <span className={`priority-badge priority-${priority}`}>
      <span className="sr-only">優先度: </span>
      {PRIORITY_LABELS[priority]}
    </span>
  )
}
