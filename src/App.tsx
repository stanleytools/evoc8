import { useEffect, useState } from 'react';
import { useCheckResults } from './checks/runner';
import { DebugPanel } from './components/DebugPanel';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Results } from './components/Results';
import { StatusBadge } from './components/StatusBadge';
import { exercises } from './exercises';
import { testConfig } from './test.config';

type View = number | 'results';

function readViewFromHash(): View {
  const hash = window.location.hash.replace('#', '');
  if (hash === 'results') return 'results';
  const id = Number(hash);
  return exercises.some((exercise) => exercise.id === id) ? id : 1;
}

export function App() {
  const [view, setView] = useState<View>(readViewFromHash);
  const checks = useCheckResults();

  useEffect(() => {
    const onHashChange = () => setView(readViewFromHash());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const exercise = exercises.find((entry) => entry.id === view);
  const Feature = exercise?.Component;

  return (
    <div className="layout">
      <nav className="sidebar" aria-label="Exercises">
        <h1>Storefront</h1>
        <p className="muted">Live debugging exercises</p>
        <ol>
          {exercises.map((entry) => {
            const passed = checks.results[entry.id] === 'pass';
            const classes = [entry.id === view ? 'active' : '', passed ? 'passed' : ''];
            return (
              <li key={entry.id}>
                <a
                  href={`#${entry.id}`}
                  title={`${entry.title}${passed ? ' (passing)' : ''}`}
                  className={classes.join(' ').trim() || undefined}
                >
                  <span className="number">{entry.id}</span>
                  <span className="title">{entry.title}</span>
                  {passed && (
                    <span className="tick" aria-label="passing">
                      &#10003;
                    </span>
                  )}
                </a>
              </li>
            );
          })}
          <li>
            <a href="#results" className={view === 'results' ? 'active results-link' : 'results-link'}>
              Results
            </a>
          </li>
        </ol>
        <p className="muted small test-code">Test {testConfig.id}</p>
      </nav>

      <main>
        {exercise && Feature ? (
          <>
            <section className="card ticket">
              <div className="row-between ticket-head">
                <p className="eyebrow">
                  Exercise {exercise.id} of {exercises.length}
                </p>
                <StatusBadge status={checks.results[exercise.id]} rechecking={checks.running} />
              </div>
              <h2>{exercise.title}</h2>

              <dl>
                <dt>Steps to reproduce</dt>
                <dd>
                  <ol>
                    {exercise.steps.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ol>
                </dd>
                <dt>Expected</dt>
                <dd>{exercise.expected}</dd>
                <dt>Actual</dt>
                <dd>{exercise.actual}</dd>
                {exercise.note && (
                  <>
                    <dt>Constraint</dt>
                    <dd>{exercise.note}</dd>
                  </>
                )}
                <dt>Code</dt>
                <dd>
                  <code>{exercise.folder}</code>
                </dd>
              </dl>
            </section>

            <section className="card">
              <p className="eyebrow">Live feature</p>
              <ErrorBoundary key={exercise.id}>
                <Feature />
              </ErrorBoundary>
            </section>

            <DebugPanel sliceKey={exercise.sliceKey} />
          </>
        ) : (
          <Results exercises={exercises} checks={checks} />
        )}
      </main>
    </div>
  );
}
