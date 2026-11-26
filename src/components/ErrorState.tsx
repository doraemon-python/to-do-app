import { AlertIcon, RefreshIcon } from './icons'

type ErrorStateProps = {
  message: string
  onRetry: () => void
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="state-card error-state">
      <div className="state-icon" aria-hidden="true">
        <AlertIcon />
      </div>
      <div role="alert">
        <h3>読み込みに失敗しました</h3>
        <p>{message}</p>
      </div>
      <button type="button" className="secondary-button" onClick={onRetry}>
        <RefreshIcon />
        再読み込み
      </button>
    </div>
  )
}
