import { HomeAssistantRXJS } from '..';

export enum Light {
  Domain = 'light',
  TurnOn = 'turn_on',
  TurnOff = 'turn_off',
  Toggle = 'toggle',
}

export interface CommonLightAttributes {
  entity_id: string;
  transition: number;
  flash: 'short' | 'long';
}

export interface LightTurnOnAttributes extends CommonLightAttributes {
  rgb_color: [number, number, number];
  color_name: string;
  hs_color: [number, number];
  xy_color: [number, number];
  color_temp: number;
  kelvin: number;
  white_value: number;
  brightness: number;
  brightness_pct: number;
  brightness_step: number;
  brightness_step_pct: number;
  profile: string;
  effect: string;
}

export interface LightTurnOffAttributes extends CommonLightAttributes {}

export class HomeAssistantLights {
  constructor(private ha: HomeAssistantRXJS) {}

  turnOn(entity_id: string, attributes = {} as Partial<LightTurnOnAttributes>) {
    return this.ha.services.call(Light.Domain, Light.TurnOn, {
      ...attributes,
      entity_id,
    });
  }

  turnOff(
    entity_id: string,
    attributes = {} as Partial<LightTurnOffAttributes>,
  ) {
    return this.ha.services.call(Light.Domain, Light.TurnOff, {
      ...attributes,
      entity_id,
    });
  }

  toggle(entity_id: string, attributes = {} as Partial<LightTurnOnAttributes>) {
    return this.ha.services.call(Light.Domain, Light.Toggle, {
      entity_id,
      ...attributes,
    });
  }
}
