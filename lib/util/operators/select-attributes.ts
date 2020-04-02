import { HassEntity } from 'home-assistant-js-websocket';
import { Observable } from 'rxjs';
import { distinctUntilChanged, pluck } from 'rxjs/operators';

export function selectAttributes() {
  return function selectStateOperator(
    source$: Observable<HassEntity>,
  ): Observable<HassEntity['attributes']> {
    return source$.pipe(pluck('attributes'), distinctUntilChanged());
  };
}
