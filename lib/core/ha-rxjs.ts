import dotenv from 'dotenv';
import { Subject } from 'rxjs';
import { HomeAssistantConnection } from '../connection';
import { HomeAssistantLights } from '../lights';
import { Logger } from '../util/logger';
import { HomeAssistantEntities } from './entities';
import { HomeAssistantServices } from './services';

export class HomeAssistantRXJS {
  constructor() {
    dotenv.config();
  }
  readonly destroy$ = new Subject<void>();
  readonly logger = new Logger(process.env);

  private readonly connection = new HomeAssistantConnection();
  readonly connection$ = this.connection.asObservable();

  readonly services = new HomeAssistantServices(
    this,
    this.destroy$,
    this.logger,
  );
  readonly entities = new HomeAssistantEntities(this, this.destroy$);
  readonly lights = new HomeAssistantLights(this);

  async initialize() {
    await this.connection.connect();
  }

  destroy() {
    console.log('Closing connection');
    this.destroy$.next();
    this.destroy$.complete();
    this.connection.disconnect();
  }
}
