import { LeafIcon } from './icons'

export function EmptyState() {
  return (
    <div className="state-card empty-state">
      <div className="empty-illustration" aria-hidden="true">
        <LeafIcon />
      </div>
      <h3>タスクはまだありません</h3>
      <p>上のフォームから、最初のタスクを追加してみましょう。</p>
    </div>
  )
}
