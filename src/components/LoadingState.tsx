export function LoadingState() {
  return (
    <div
      className="state-card loading-state"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="sr-only">タスクを読み込んでいます...</span>
      <div className="skeleton-list" aria-hidden="true">
        {[0, 1, 2].map((item) => (
          <div key={item} className="skeleton-card">
            <span className="skeleton skeleton-check" />
            <span className="skeleton skeleton-line" />
            <span className="skeleton skeleton-badge" />
          </div>
        ))}
      </div>
    </div>
  )
}
