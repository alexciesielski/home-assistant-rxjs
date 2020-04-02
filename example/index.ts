import {
  delay,
  distinctUntilChanged,
  filter,
  switchMapTo,
} from 'rxjs/operators';
import { HomeAssistantRXJS, select } from '../lib';

const home = new HomeAssistantRXJS();
home.initialize();

const motion$ = home.entities.pipe(
  select('binary_sensor.hall_motion_sensor', 'state'),
);

// When motion detected turn the light on
// and after 2 seconds turn it off
motion$
  .pipe(
    distinctUntilChanged(),
    filter(state => state === 'on'),
    switchMapTo(home.lights.turnOn('light.hall_light')),
    delay(2000),
    switchMapTo(home.lights.turnOff('light.hall_light')),
  )
  .subscribe();
