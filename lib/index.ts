import {
  createConnection,
  createLongLivedTokenAuth,
  HassConfig,
  subscribeConfig,
} from 'home-assistant-js-websocket';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { filter, switchMap, switchMapTo } from 'rxjs/operators';
import { createSocket } from './connection/create-socket';
import { HomeAssistantEntities } from './entities';
import { HomeAssistantServices } from './services';

export class HomeAssistantRXJS {
  constructor(public host: string, private token: string) {}

  readonly connection$ = from(this.connectoToHA(this.host, this.token)).pipe(
    filter(connection => !!connection),
  );

  readonly services = new HomeAssistantServices(this);
  readonly services$ = this.services.services$;

  readonly entities = new HomeAssistantEntities(this);
  readonly entities$ = this.entities.entities$;

  private readonly config = new BehaviorSubject<Partial<HassConfig>>({});
  readonly config$ = this.getConfig();

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
    );
  }

  private async connectoToHA(host: string, token: string) {
    const auth = createLongLivedTokenAuth(host, token);

    return await createConnection({
      createSocket: () => createSocket(auth, true),
    });
  }
}
