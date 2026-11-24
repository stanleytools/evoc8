/**
 * Small helpers used by the automated checks. Not part of any exercise.
 */
export const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/** Short pause that lets React finish re-rendering. */
export const settle = () => sleep(60);

export async function waitFor(condition: () => boolean, timeoutMs: number): Promise<boolean> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (condition()) return true;
    await sleep(50);
  }
  return condition();
}

export function textOf(root: Element): string {
  return root.textContent ?? '';
}

export function findButtons(root: Element, label: string): HTMLButtonElement[] {
  return Array.from(root.querySelectorAll('button')).filter(
    (button) => button.textContent?.trim() === label,
  );
}

export function click(element: Element | null | undefined): boolean {
  if (!(element instanceof HTMLElement)) return false;
  element.click();
  return true;
}

export function typeInto(input: Element | null, value: string): boolean {
  if (!(input instanceof HTMLInputElement)) return false;
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;
  setter?.call(input, value);
  input.dispatchEvent(new Event('input', { bubbles: true }));
  return true;
}
