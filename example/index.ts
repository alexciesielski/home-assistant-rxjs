import { delay, filter, switchMapTo } from 'rxjs/operators';
import { HomeAssistantRXJS, select } from '../lib';

const home = new HomeAssistantRXJS();
home.initialize();

const motion$ = home.entities.pipe(
  select('binary_sensor.office_office_motion_114', 'state'),
);

// When motion detected turn the light on
// and after 2 seconds turn it off
motion$
  .pipe(
    filter(state => state === 'on'),
    switchMapTo(home.lights.turnOn('light.office_office_ceiling_light_104')),
    delay(2000),
    switchMapTo(home.lights.turnOff('light.office_office_ceiling_light_104')),
  )
  .subscribe();
