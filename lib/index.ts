import dotenv from 'dotenv';
import {
  Connection,
  HassConfig,
  subscribeConfig,
} from 'home-assistant-js-websocket';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import {
  filter,
  map,
  switchMap,
  switchMapTo,
  take,
  takeUntil,
  tap,
} from 'rxjs/operators';
import { connectToHA } from './connection';
import { HomeAssistantEntities } from './entities';
import { HomeAssistantLights } from './lights';
import { HomeAssistantServices } from './services';

export interface HomeAssistantRXJSOptions {
  token: string;
  wsUrl: string;
}

export class HomeAssistantRXJS {
  constructor() {
    this.initialize();
  }

  private readonly destroy$ = new Subject<void>();

  private readonly connection = new BehaviorSubject<Connection | null>(null);
  readonly connection$ = this.connection.pipe(
    filter(connection => !!connection),
    // next line is to satisfy TS strictNullChecks
    map(connection => connection as Connection),
  );

  readonly services = new HomeAssistantServices(this, this.destroy$);
  readonly services$ = this.services.services$;

  readonly entities = new HomeAssistantEntities(this, this.destroy$);
  readonly entities$ = this.entities.entities$;

  readonly lights = new HomeAssistantLights(this, this.destroy$);

  private readonly config = new BehaviorSubject<Partial<HassConfig>>({});
  readonly config$ = this.getConfig();

  destroy() {
    return this.connection$.pipe(
      take(1),
      tap(() => console.log('Closing connection')),
      tap(connection => connection.close()),
      tap(() => {
        this.destroy$.next();
        this.destroy$.complete();
      }),
    );
  }

  private async initialize() {
    process.on('SIGTERM', () => this.destroy().subscribe(process.exit(0)));
    dotenv.config();

    const connection = await connectToHA();
    this.connection.next(connection);
  }

  private getConfig() {
    return this.connection$.pipe(
      switchMap(
        connection =>
          new Observable<HassConfig>(subscriber => {
            const unsubscribe = subscribeConfig(connection, config =>
              subscriber.next(config),
            );

            subscriber.add(() => unsubscribe());
          }),
      ),
      switchMapTo(this.config.asObservable()),
      takeUntil(this.destroy$),
    );
  }
}
