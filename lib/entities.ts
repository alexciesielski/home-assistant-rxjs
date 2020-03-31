import { HassEntities, subscribeEntities } from 'home-assistant-js-websocket';
import { BehaviorSubject, Observable } from 'rxjs';
import { shareReplay, switchMap, switchMapTo, tap } from 'rxjs/operators';
import { HomeAssistantRXJS } from './index';

export class HomeAssistantEntities {
  constructor(private ha: HomeAssistantRXJS) {}

  private readonly entities = new BehaviorSubject<Partial<HassEntities>>({});

  readonly entities$ = this.subscribeEntities();

  private subscribeEntities() {
    return this.ha.connection$.pipe(
      switchMap(
        connection =>
          new Observable<HassEntities>(subscriber => {
            const unsubscribe = subscribeEntities(connection, entities =>
              subscriber.next(entities),
            );

            subscriber.add(() => {
              subscriber.complete();
              unsubscribe();
            });
          }),
      ),
      tap(entities => this.entities.next(entities)),
      shareReplay({ refCount: true, bufferSize: 1 }),
      switchMapTo(this.entities.asObservable()),
    );
  }
}
