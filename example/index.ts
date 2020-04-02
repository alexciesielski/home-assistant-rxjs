import {
  delay,
  distinctUntilChanged,
  filter,
  switchMapTo,
} from 'rxjs/operators';
import { HomeAssistantRXJS, select } from '../lib';

export class Home extends HomeAssistantRXJS {
  constructor() {
    super();
    this.initialize();
  }
}

const home = new Home();

// When motion detected turn the light on
// and after 2 seconds turn it off

const motion$ = home.entities.pipe(
  select('binary_sensor.office_office_motion_114', 'state'),
);

motion$
  .pipe(
    distinctUntilChanged(),
    filter(state => state === 'on'),
    switchMapTo(home.lights.turnOn('light.office_office_ceiling_light_104')),
    delay(2000),
    switchMapTo(home.lights.turnOff('light.office_office_ceiling_light_104')),
  )
  .subscribe();
