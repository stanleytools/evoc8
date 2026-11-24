import { runChecks, type CheckSnapshot } from '../checks/runner';
import type { Exercise } from '../exercises';
import { testConfig } from '../test.config';

interface Props {
  exercises: Exercise[];
  checks: CheckSnapshot;
}

function elapsed(from: number, to: number): string {
  const totalSeconds = Math.max(0, Math.round((to - from) / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
}

export function Results({ exercises, checks }: Props) {
  const stillChecking = exercises.some((exercise) => checks.results[exercise.id] === 'checking');
  const passedCount = exercises.filter((exercise) => checks.results[exercise.id] === 'pass').length;
  const overallPass = passedCount >= testConfig.passMark;

  return (
    <section className="card results">
      <p className="eyebrow">Results: test {testConfig.id}</p>

      {stillChecking ? (
        <h2>Checking...</h2>
      ) : (
        <h2>
          <span className={overallPass ? 'status pass large' : 'status fail large'}>
            {overallPass ? '✓ PASS' : 'NOT PASSED'}
          </span>
          <span className="results-count">
            {passedCount} of {exercises.length} exercises passing
          </span>
        </h2>
      )}

      <p className="muted">
        Pass mark for this test: {testConfig.passMark} of {exercises.length}. Results update
        automatically after every code change.
      </p>

      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Exercise</th>
            <th>Result</th>
            <th className="numeric">First passed at</th>
          </tr>
        </thead>
        <tbody>
          {exercises.map((exercise) => {
            const status = checks.results[exercise.id];
            const passedAt = checks.firstPassedAt[exercise.id];
            return (
              <tr key={exercise.id}>
                <td>{exercise.id}</td>
                <td>{exercise.title}</td>
                <td>
                  {status === 'pass' && <span className="status pass">&#10003; Pass</span>}
                  {status === 'fail' && <span className="status fail">Not passed</span>}
                  {status === 'checking' && <span className="status checking">Checking...</span>}
                </td>
                <td className="numeric">
                  {passedAt === undefined ? '' : elapsed(checks.startedAt, passedAt)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="row-between">
        <span className="muted small">
          Times are minutes:seconds since this test was first opened ({new Date(checks.startedAt).toLocaleString()}).
        </span>
        <button
          type="button"
          className="secondary"
          disabled={checks.running}
          onClick={() => void runChecks()}
        >
          {checks.running ? 'Checking...' : 'Re-run checks'}
        </button>
      </div>
    </section>
  );
}
