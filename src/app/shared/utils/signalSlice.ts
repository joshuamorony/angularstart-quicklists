import { Signal, WritableSignal, signal } from '@angular/core';
import { connect } from 'ngxtension/connect';
import { Observable, Subject } from 'rxjs';

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
  [K in keyof TReducers]: (nextValue: Parameters<TReducers[K]>[1]) => void;
};

type SignalWithActions<TSignalValue, TActions> = TSignalValue & {
  [K in keyof TActions]: TActions[K];
};

export function signalSlice<TSignalValue>(config: {
  initialState: TSignalValue;
  sources?: Array<Observable<PartialOrValue<TSignalValue>>>;
  reducers?: NamedReducers<TSignalValue>;
}): SignalWithActions<
  Signal<TSignalValue>,
  ActionMethods<TSignalValue, NamedReducers<TSignalValue>>
> {
  const { initialState, sources, reducers = {} } = config;

  let state = signal(initialState);

  if (sources) {
    for (const source of sources) {
      connect(state, source);
    }
  }

  let actions = {} as ActionMethods<TSignalValue, NamedReducers<TSignalValue>>;

  for (const key in reducers) {
    if (reducers.hasOwnProperty(key)) {
      const action$ = createAction(reducers[key], state);
      actions[key as keyof NamedReducers<TSignalValue>] = (nextValue) =>
        action$.next(nextValue);
    }
  }

  return { ...state.asReadonly(), ...actions } as SignalWithActions<
    Signal<TSignalValue>,
    ActionMethods<TSignalValue, NamedReducers<TSignalValue>>
  >;
}

function createAction<TSignalValue, TNext>(
  reducer: Reducer<TSignalValue, TNext>,
  state: WritableSignal<TSignalValue>
): Subject<TNext> {
  const action$ = new Subject<TNext>();
  connect(state, action$, reducer);
  return action$;
}
