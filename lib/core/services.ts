import {
  callService,
  HassServices,
  subscribeServices,
} from 'home-assistant-js-websocket';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { switchMap, switchMapTo, takeUntil, tap } from 'rxjs/operators';
import { Logger } from '../util/logger';
import { HomeAssistantRXJS } from './ha-rxjs';

export class HomeAssistantServices extends BehaviorSubject<HassServices> {
  constructor(
    private ha: HomeAssistantRXJS,
    private destroy$: Observable<void>,
    private logger: Logger,
  ) {
    super({});
    this.subscribeServices();
  }

  call<T extends object>(domain: string, service: string, serviceData?: T) {
    return this.ha.connection$.pipe(
      switchMap(connection =>
        from(callService(connection, domain, service, serviceData)),
      ),
      tap(() => this.logger.info(`Called ${domain}.${service}`, serviceData)),
      takeUntil(this.destroy$),
    );
  }

  private subscribeServices() {
    return this.ha.connection$
      .pipe(
        switchMap(
          connection =>
            new Observable<HassServices>(subscriber =>
              subscribeServices(connection, services =>
                subscriber.next(services),
              ),
            ),
        ),
        tap(services => this.next(services)),
        switchMapTo(this.asObservable()),
        takeUntil(this.destroy$),
      )
      .subscribe({
        complete: () => this.complete(),
      });
  }
}
