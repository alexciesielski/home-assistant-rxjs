import {
  createConnection,
  createLongLivedTokenAuth,
  HassConfig,
  subscribeConfig,
} from 'home-assistant-js-websocket';
import { BehaviorSubject, from, Observable, Subject } from 'rxjs';
import {
  filter,
  switchMap,
  switchMapTo,
  take,
  takeUntil,
  tap,
} from 'rxjs/operators';
import { createSocket } from './connection/create-socket';
import { HomeAssistantEntities } from './entities';
import { HomeAssistantServices } from './services';

export class HomeAssistantRXJS {
  constructor(public host: string, private token: string) {
    process.on('SIGTERM', () => this.destroy().subscribe(process.exit(0)));
  }

  private readonly destroy$ = new Subject<void>();
  readonly connection$ = from(this.connectoToHA(this.host, this.token)).pipe(
    filter(connection => !!connection),
  );

  readonly services = new HomeAssistantServices(
    this.connection$,
    this.destroy$,
  );
  readonly services$ = this.services.services$;

  readonly entities = new HomeAssistantEntities(
    this.connection$,
    this.destroy$,
  );
  readonly entities$ = this.entities.entities$;

  private readonly config = new BehaviorSubject<Partial<HassConfig>>({});
  readonly config$ = this.getConfig();

  destroy() {
    this.destroy$.next();
    this.destroy$.complete();
    return this.connection$.pipe(
      take(1),
      tap(connection => connection.close()),
    );
  }

  private getConfig() {
    return this.connection$.pipe(
      switchMap(
        connection =>
          new Observable<HassConfig>(subscriber => {
            const unsubscribe = subscribeConfig(connection, config =>
              subscriber.next(config),
            );

            subscriber.add(() => {
              subscriber.complete();
              unsubscribe();
            });
          }),
      ),
      switchMapTo(this.config.asObservable()),
      takeUntil(this.destroy$),
    );
  }

  private connectoToHA(host: string, token: string) {
    const auth = createLongLivedTokenAuth(host, token);

    return createConnection({
      createSocket: () => createSocket(auth, true),
    });
  }
}
