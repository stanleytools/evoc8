import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Feature crashed:', error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="error" role="alert">
          <strong>This feature crashed.</strong>
          <pre>{this.state.error.message}</pre>
          <p className="muted">The full stack trace is in the browser console.</p>
          <button type="button" onClick={() => this.setState({ error: null })}>
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
