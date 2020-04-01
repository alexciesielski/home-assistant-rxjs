import {
  callService,
  getServices,
  HassServices,
  subscribeServices,
} from 'home-assistant-js-websocket';
import { BehaviorSubject, from, Observable } from 'rxjs';
import {
  shareReplay,
  switchMap,
  switchMapTo,
  take,
  takeUntil,
  tap,
} from 'rxjs/operators';
import { HomeAssistantRXJS } from '.';

export class HomeAssistantServices {
  constructor(
    private ha: HomeAssistantRXJS,
    private destroy$: Observable<void>,
  ) {}

  private readonly services = new BehaviorSubject<Partial<HassServices>>({});

  readonly services$ = this.subscribeServices();

  call<T extends object>(domain: string, service: string, serviceData?: T) {
    return this.ha.connection$.pipe(
      switchMap(connection =>
        from(callService(connection, domain, service, serviceData)),
      ),
      takeUntil(this.destroy$),
    );
  }

  getServicesOnce() {
    return this.ha.connection$.pipe(
      switchMap(connection => from(getServices(connection))),
      take(1),
      takeUntil(this.destroy$),
    );
  }

  private subscribeServices() {
    return this.ha.connection$.pipe(
      switchMap(
        connection =>
          new Observable<HassServices>(subscriber => {
            const unsubscribe = subscribeServices(connection, services =>
              subscriber.next(services),
            );

            subscriber.add(() => unsubscribe());
          }),
      ),
      tap(services => this.services.next(services)),
      shareReplay({ refCount: true, bufferSize: 1 }),
      switchMapTo(this.services.asObservable()),
      takeUntil(this.destroy$),
    );
  }
}
