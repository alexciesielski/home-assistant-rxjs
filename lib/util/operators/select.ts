// https://github.com/ngrx/platform/blob/master/modules/store/src/store.ts

import { Observable } from 'rxjs';
import { distinctUntilChanged, map, pluck } from 'rxjs/operators';

export function select<T, Props, K>(
  mapFn: (state: T, props: Props) => K,
  props?: Props,
): (source$: Observable<T>) => Observable<K>;
export function select<T, a extends keyof T>(
  key: a,
): (source$: Observable<T>) => Observable<T[a]>;
export function select<T, a extends keyof T, b extends keyof T[a]>(
  key1: a,
  key2: b,
): (source$: Observable<T>) => Observable<T[a][b]>;
export function select<
  T,
  a extends keyof T,
  b extends keyof T[a],
  c extends keyof T[a][b]
>(
  key1: a,
  key2: b,
  key3: c,
): (source$: Observable<T>) => Observable<T[a][b][c]>;
export function select<
  T,
  a extends keyof T,
  b extends keyof T[a],
  c extends keyof T[a][b],
  d extends keyof T[a][b][c]
>(
  key1: a,
  key2: b,
  key3: c,
  key4: d,
): (source$: Observable<T>) => Observable<T[a][b][c][d]>;
export function select<
  T,
  a extends keyof T,
  b extends keyof T[a],
  c extends keyof T[a][b],
  d extends keyof T[a][b][c],
  e extends keyof T[a][b][c][d]
>(
  key1: a,
  key2: b,
  key3: c,
  key4: d,
  key5: e,
): (source$: Observable<T>) => Observable<T[a][b][c][d][e]>;
export function select<
  T,
  a extends keyof T,
  b extends keyof T[a],
  c extends keyof T[a][b],
  d extends keyof T[a][b][c],
  e extends keyof T[a][b][c][d],
  f extends keyof T[a][b][c][d][e]
>(
  key1: a,
  key2: b,
  key3: c,
  key4: d,
  key5: e,
  key6: f,
): (source$: Observable<T>) => Observable<T[a][b][c][d][e][f]>;
export function select<
  T,
  a extends keyof T,
  b extends keyof T[a],
  c extends keyof T[a][b],
  d extends keyof T[a][b][c],
  e extends keyof T[a][b][c][d],
  f extends keyof T[a][b][c][d][e],
  K = any
>(
  key1: a,
  key2: b,
  key3: c,
  key4: d,
  key5: e,
  key6: f,
  ...paths: string[]
): (source$: Observable<T>) => Observable<K>;
export function select<T, Props, K>(
  pathOrMapFn: ((state: T, props?: Props) => any) | string,
  propsOrPath?: Props | string,
  ...paths: string[]
) {
  return function selectOperator(source$: Observable<T>): Observable<K> {
    let mapped$: Observable<any>;

    if (typeof pathOrMapFn === 'string') {
      const pathSlices = [propsOrPath as string, ...paths].filter(Boolean);
      mapped$ = source$.pipe(pluck(pathOrMapFn, ...pathSlices));
    } else if (typeof pathOrMapFn === 'function') {
      mapped$ = source$.pipe(
        map(source => pathOrMapFn(source, propsOrPath as Props)),
      );
    } else {
      throw new TypeError(
        `Unexpected type '${typeof pathOrMapFn}' in select operator,` +
          ` expected 'string' or 'function'`,
      );
    }

    return mapped$.pipe(distinctUntilChanged());
  };
}
