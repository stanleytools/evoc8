import { useSyncExternalStore } from 'react';
import { getActionLog, subscribeToActionLog } from '../app/actionLog';
import { useAppSelector } from '../app/hooks';
import type { RootState } from '../app/store';

interface Props {
  sliceKey: keyof RootState;
}

export function DebugPanel({ sliceKey }: Props) {
  const sliceState = useAppSelector((state) => state[sliceKey]);
  const actions = useSyncExternalStore(subscribeToActionLog, getActionLog);

  return (
    <details className="debug">
      <summary>Debug panel</summary>
      <div className="debug-grid">
        <div>
          <h4>
            Redux state: <code>state.{sliceKey}</code>
          </h4>
          <pre>{JSON.stringify(sliceState, null, 2)}</pre>
        </div>
        <div>
          <h4>Recent actions (newest first)</h4>
          {actions.length === 0 ? (
            <p className="muted">No actions dispatched yet.</p>
          ) : (
            <ol className="action-log">
              {actions.map((action) => (
                <li key={action.id}>
                  <code>{action.type}</code>
                  {action.payload && <span className="muted"> {action.payload}</span>}
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </details>
  );
}
