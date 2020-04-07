import { HassEntities, HassEntity } from 'home-assistant-js-websocket';
import { Observable } from 'rxjs';
import { select } from './select';

export function selectState(id: string) {
  return function (
    source$: Observable<HassEntities>,
  ): Observable<HassEntity['state']> {
    return source$.pipe(select(id, 'state'));
  };
}
