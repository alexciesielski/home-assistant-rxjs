import { tap } from 'rxjs/operators';
import { HomeAssistantRXJS } from '../lib';
import { select } from '../lib/util';

export class Room {
  constructor(private ha: HomeAssistantRXJS) {}

  readonly motion$ = this.ha.entities.pipe(
    select('binary_sensor.office_office_motion_114', 'state'),
    tap(_ => console.log('motion', _)),
  );

  turnOnCeilingLight() {
    return this.ha.lights.turnOn('light.office_office_ceiling_light_104');
  }

  turnOffCeilingLight() {
    return this.ha.lights.turnOff('light.office_office_ceiling_light_104');
  }
}
