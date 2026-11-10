import { useEffect, useState } from 'react';
import { DebugPanel } from './components/DebugPanel';
import { ErrorBoundary } from './components/ErrorBoundary';
import { exercises } from './exercises';

function readExerciseFromHash(): number {
  const id = Number(window.location.hash.replace('#', ''));
  return exercises.some((exercise) => exercise.id === id) ? id : 1;
}

export function App() {
  const [activeId, setActiveId] = useState(readExerciseFromHash);

  useEffect(() => {
    const onHashChange = () => setActiveId(readExerciseFromHash());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const exercise = exercises.find((entry) => entry.id === activeId) ?? exercises[0];
  const Feature = exercise.Component;

  return (
    <div className="layout">
      <nav className="sidebar" aria-label="Exercises">
        <h1>Storefront</h1>
        <p className="muted">Live debugging exercises</p>
        <ol>
          {exercises.map((entry) => (
            <li key={entry.id}>
              <a
                href={`#${entry.id}`}
                title={entry.title}
                className={entry.id === exercise.id ? 'active' : undefined}
              >
                <span className="number">{entry.id}</span>
                <span className="title">{entry.title}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <main>
        <section className="card ticket">
          <p className="eyebrow">
            Exercise {exercise.id} of {exercises.length}
          </p>
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
      </main>
    </div>
  );
}
