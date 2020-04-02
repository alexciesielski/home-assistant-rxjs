import { HassEntities, HassEntity } from 'home-assistant-js-websocket';
import { Observable } from 'rxjs';
import { select } from './select';

export function selectAttributes(id: string) {
  return function selectStateOperator(
    source$: Observable<HassEntities>,
  ): Observable<HassEntity['attributes']> {
    return source$.pipe(select(id, 'attributes'));
  };
}
