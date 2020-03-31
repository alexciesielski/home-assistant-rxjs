import {
  Connection,
  HassEntities,
  subscribeEntities,
} from 'home-assistant-js-websocket';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  shareReplay,
  switchMap,
  switchMapTo,
  takeUntil,
  tap,
} from 'rxjs/operators';

export class HomeAssistantEntities {
  constructor(
    private connection$: Observable<Connection>,
    private destroy$: Observable<void>,
  ) {}

  private readonly entities = new BehaviorSubject<Partial<HassEntities>>({});

  readonly entities$ = this.subscribeEntities();

  private subscribeEntities() {
    return this.connection$.pipe(
      switchMap(
        connection =>
          new Observable<HassEntities>(subscriber => {
            const unsubscribe = subscribeEntities(connection, entities =>
              subscriber.next(entities),
            );

            subscriber.add(() => unsubscribe());
          }),
      ),
      tap(entities => this.entities.next(entities)),
      shareReplay({ refCount: true, bufferSize: 1 }),
      switchMapTo(this.entities.asObservable()),
      takeUntil(this.destroy$),
    );
  }
}
