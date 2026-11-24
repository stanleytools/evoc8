import { Component, type ComponentType, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { makeStore } from '../app/store';
import { waitFor } from './dom';

/**
 * Renders a feature off screen with its own private store, so a check can
 * use the feature like a customer would without touching what is on screen.
 * Not part of any exercise.
 */
class CrashCatcher extends Component<{ onCrash: () => void; children: ReactNode }, { crashed: boolean }> {
  state = { crashed: false };

  static getDerivedStateFromError() {
    return { crashed: true };
  }

  componentDidCatch() {
    this.props.onCrash();
  }

  render() {
    return this.state.crashed ? null : this.props.children;
  }
}

export interface MountedFeature {
  host: HTMLElement;
  crashed: () => boolean;
  unmount: () => void;
}

export async function mountFeature(Feature: ComponentType): Promise<MountedFeature> {
  const host = document.createElement('div');
  host.hidden = true;
  host.setAttribute('data-automated-check', '');
  document.body.appendChild(host);

  let crashed = false;
  const quiet = () => {};
  const root = createRoot(host, {
    onCaughtError: quiet,
    onUncaughtError: quiet,
    onRecoverableError: quiet,
  });

  root.render(
    <Provider store={makeStore({ actionLog: false })}>
      <CrashCatcher onCrash={() => (crashed = true)}>
        <Feature />
      </CrashCatcher>
    </Provider>,
  );

  await waitFor(() => host.childElementCount > 0 || crashed, 1000);

  return {
    host,
    crashed: () => crashed,
    unmount: () => {
      root.unmount();
      host.remove();
    },
  };
}
