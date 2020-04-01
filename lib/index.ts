import { Subject } from 'rxjs';
import { HomeAssistantConnection } from './connection';
import { HomeAssistantEntities } from './entities';
import { HomeAssistantLights } from './lights';
import { HomeAssistantServices } from './services';

export interface HomeAssistantRXJSOptions {
  token: string;
  wsUrl: string;
}

export class HomeAssistantRXJS {
  constructor() {
    process.on('SIGTERM', () => this.destroy());
  }

  readonly destroy$ = new Subject<void>();

  private readonly connection = new HomeAssistantConnection();
  readonly connection$ = this.connection.asObservable();

  readonly services = new HomeAssistantServices(this, this.destroy$);
  readonly entities = new HomeAssistantEntities(this, this.destroy$);
  readonly lights = new HomeAssistantLights(this);

  destroy() {
    console.log('Closing connection');
    this.destroy$.next();
    this.destroy$.complete();
    this.connection.disconnect();
    process.exit(0);
  }
}
