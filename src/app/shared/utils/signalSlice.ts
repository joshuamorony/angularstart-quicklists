import { DestroyRef, Signal, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { connect } from 'ngxtension/connect';
import { Observable, Subject, isObservable } from 'rxjs';

type PartialOrValue<TValue> = TValue extends object ? Partial<TValue> : TValue;
type Reducer<TValue, TNext> = (
  previous: TValue,
  next: TNext
) => PartialOrValue<TValue>;

type NamedReducers<TSignalValue> = {
  [actionName: string]: Reducer<TSignalValue, any>;
};

type ActionMethods<
  TSignalValue,
  TReducers extends NamedReducers<TSignalValue>
> = {
  [K in keyof TReducers]: TReducers[K] extends Reducer<TSignalValue, unknown>
    ? () => void
    : TReducers[K] extends Reducer<TSignalValue, infer TValue>
    ? (value: TValue | Observable<TValue>) => void
    : never;
};

type ActionStreams<
  TSignalValue,
  TReducers extends NamedReducers<TSignalValue>
> = {
  [K in keyof TReducers & string as `${K}$`]: TReducers[K] extends Reducer<
    TSignalValue,
    unknown
  >
    ? Observable<void>
    : TReducers[K] extends Reducer<TSignalValue, infer TValue>
    ? Observable<TValue>
    : never;
};

type SignalWithActions<
  TSignalValue,
  TReducers extends NamedReducers<TSignalValue>
> = Signal<TSignalValue> &
  ActionMethods<TSignalValue, TReducers> &
  ActionStreams<TSignalValue, TReducers>;

export function signalSlice<
  TSignalValue,
  TReducers extends NamedReducers<TSignalValue>
>(config: {
  initialState: TSignalValue;
  sources?: Array<Observable<PartialOrValue<TSignalValue>>>;
  reducers?: TReducers;
}): SignalWithActions<TSignalValue, TReducers> {
  const destroyRef = inject(DestroyRef);
  const { initialState, sources = [], reducers = {} } = config;

  const state = signal(initialState);

  for (const source of sources) {
    connect(state, source);
  }

  const readonlyState = state.asReadonly();
  const subs: Subject<unknown>[] = [];

  for (const [key, reducer] of Object.entries(reducers as TReducers)) {
    const subject = new Subject();
    connect(state, subject, reducer);
    Object.defineProperties(readonlyState, {
      [key]: {
        value: (nextValue: unknown) => {
          if (isObservable(nextValue)) {
            nextValue.pipe(takeUntilDestroyed(destroyRef)).subscribe(subject);
          } else {
            subject.next(nextValue);
          }
        },
      },
      [`${key}$`]: {
        value: subject.asObservable(),
      },
    });
    subs.push(subject);
  }

  destroyRef.onDestroy(() => {
    subs.forEach((sub) => sub.complete());
  });

  return readonlyState as SignalWithActions<TSignalValue, TReducers>;
}
