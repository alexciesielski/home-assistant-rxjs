import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

export function filterNullOrUndefined() {
  return function <T>(source$: Observable<T>): Observable<NonNullable<T>> {
    return source$.pipe(
      filter(x => Boolean(x)),
      map(x => x as NonNullable<T>),
    );
  };
}
