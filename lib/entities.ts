import { HassEntities, subscribeEntities } from 'home-assistant-js-websocket';
import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap, takeUntil, tap } from 'rxjs/operators';
import { HomeAssistantRXJS } from '.';

export class HomeAssistantEntities extends BehaviorSubject<HassEntities> {
  constructor(
    private ha: HomeAssistantRXJS,
    private destroy$: Observable<void>,
  ) {
    super({});
    this.subscribeEntities();
  }

  private subscribeEntities() {
    return this.ha.connection$
      .pipe(
        switchMap(
          connection =>
            new Observable<HassEntities>(subscriber =>
              subscribeEntities(connection, entities =>
                subscriber.next(entities),
              ),
            ),
        ),
        tap(entities => this.next(entities)),
        takeUntil(this.destroy$),
      )
      .subscribe({
        complete: () => this.complete(),
      });
  }
}
