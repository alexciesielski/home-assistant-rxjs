import * as ha from 'home-assistant-js-websocket';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { shareReplay, switchMap, switchMapTo, take, tap } from 'rxjs/operators';
import { HomeAssistantRXJS } from './index';

export class HomeAssistantServices {
  constructor(private ha: HomeAssistantRXJS) {}

  private readonly services = new BehaviorSubject<Partial<ha.HassServices>>({});

  readonly services$ = this.subscribeServices();

  call<T extends object>(domain: string, service: string, serviceData?: T) {
    return this.ha.connection$.pipe(
      switchMap(connection =>
        from(ha.callService(connection, domain, service, serviceData)),
      ),
    );
  }

  getServicesOnce() {
    return this.ha.connection$.pipe(
      switchMap(connection => from(ha.getServices(connection))),
      take(1),
    );
  }

  private subscribeServices() {
    return this.ha.connection$.pipe(
      switchMap(
        connection =>
          new Observable<ha.HassServices>(subscriber => {
            const unsubscribe = ha.subscribeServices(connection, services =>
              subscriber.next(services),
            );

            subscriber.add(() => {
              subscriber.complete();
              unsubscribe();
            });
          }),
      ),
      tap(services => this.services.next(services)),
      shareReplay({ refCount: true, bufferSize: 1 }),
      switchMapTo(this.services.asObservable()),
    );
  }
}
