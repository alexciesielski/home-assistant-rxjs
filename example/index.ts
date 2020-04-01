import { tap } from 'rxjs/operators';
import { HomeAssistantRXJS } from '../lib';

const ha = new HomeAssistantRXJS();
ha.entities.pipe(tap(console.log)).subscribe();
// ha.connection$.pipe(tap(console.log), take(1)).subscribe(() => ha.destroy());
// harxjs.destroy();
/* const office = new Office(harxjs);
office.motion$
  .pipe(
    // filter(state => state === 'on'),
    switchMapTo(office.turnOnCeilingLight()),
    delay(2000),
    switchMapTo(office.turnOffCeilingLight()),
    tap(() => harxjs.destroy()),
    take(1),
  )
  .subscribe(); */
