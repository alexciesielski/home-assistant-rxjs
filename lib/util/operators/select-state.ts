import { HassEntity } from 'home-assistant-js-websocket';
import { Observable } from 'rxjs';
import { distinctUntilChanged, pluck } from 'rxjs/operators';

export function selectState() {
  return function selectStateOperator(
    source$: Observable<HassEntity>,
  ): Observable<HassEntity['state']> {
    return source$.pipe(pluck('state'), distinctUntilChanged());
  };
}
