import { signal } from '@angular/core';
import { connect } from 'ngxtension/connect';
import { Observable } from 'rxjs';

type PartialOrValue<TValue> = TValue extends object ? Partial<TValue> : TValue;
type Reducer<TValue, TNext> = (
  previous: TValue,
  next: TNext
) => PartialOrValue<TValue>;

export function connectSignal<TSignalValue>(
  value: TSignalValue,
  ...args: Array<
    | Observable<PartialOrValue<TSignalValue>>
    | [Observable<any>, Reducer<TSignalValue, any>]
  >
) {
  const valueSignal = signal(value);

  for (const arg of args) {
    if (Array.isArray(arg)) {
      connect(valueSignal, arg[0], arg[1]);
    } else {
      connect(valueSignal, arg);
    }
  }

  return valueSignal.asReadonly();
}
