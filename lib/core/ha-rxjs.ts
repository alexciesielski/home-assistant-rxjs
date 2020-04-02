import { Subject } from 'rxjs';
import { HomeAssistantConnection } from '../connection';
import { HomeAssistantLights } from '../lights';
import { HomeAssistantEntities } from './entities';
import { HomeAssistantServices } from './services';

export class HomeAssistantRXJS {
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
  }
}
