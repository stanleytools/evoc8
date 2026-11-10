import type { CheckStatus } from '../checks/runner';

interface Props {
  status: CheckStatus;
  rechecking?: boolean;
}

export function StatusBadge({ status, rechecking = false }: Props) {
  return (
    <span className="status-wrap">
      {status === 'pass' && <span className="status pass">&#10003; Pass</span>}
      {status === 'fail' && <span className="status todo">Not passing yet</span>}
      {status === 'checking' && <span className="status checking">Checking...</span>}
      {rechecking && status !== 'checking' && <span className="muted small">re-checking...</span>}
    </span>
  );
}
