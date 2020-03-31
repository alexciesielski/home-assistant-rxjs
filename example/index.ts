import { delay, filter, switchMapTo } from 'rxjs/operators';
import { HomeAssistantRXJS } from '../lib';
import { Office } from './office';

const harxjs = new HomeAssistantRXJS();
const office = new Office(harxjs);
office.motion$
  .pipe(
    filter(state => state === 'on'),
    switchMapTo(office.turnOnCeilingLight()),
    delay(5000),
    switchMapTo(office.turnOffCeilingLight()),
  )
  .subscribe();
