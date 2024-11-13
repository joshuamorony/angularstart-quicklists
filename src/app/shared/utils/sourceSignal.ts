import { Signal, signal, untracked, effect } from '@angular/core';

export function sourceSignal<T>(val: T | undefined = undefined) {
  return signal<T | undefined>(val, { equal: () => false });
}

export function reducer<T>(
  source: Signal<T>,
  nonReactiveReadsFn: (val: T) => void,
) {
  effect(() => {
    const val = source();
    untracked(() => nonReactiveReadsFn(val));
  });
}
