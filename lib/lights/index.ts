import { Observable } from 'rxjs';
import { HomeAssistantRXJS } from '..';

export enum Light {
  Domain = 'light',
  TurnOn = 'turn_on',
  TurnOff = 'turn_off',
  Toggle = 'toggle',
}

export class HomeAssistantLights {
  constructor(
    private ha: HomeAssistantRXJS,
    private destroy$: Observable<void>,
  ) {}

  turnOn(entity_id: string, attributes = {}) {
    return this.ha.services.call(Light.Domain, Light.TurnOn, {
      ...attributes,
      entity_id,
    });
  }

  turnOff(entity_id: string, attributes = {}) {
    return this.ha.services.call(Light.Domain, Light.TurnOff, {
      ...attributes,
      entity_id,
    });
  }

  toggle(entity_id: string, attributes = {}) {
    return this.ha.services.call(Light.Domain, Light.Toggle, {
      ...attributes,
      entity_id,
    });
  }
}
