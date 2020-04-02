import {
  delay,
  distinctUntilChanged,
  filter,
  switchMapTo,
} from 'rxjs/operators';
import { HomeAssistantRXJS } from '../lib';
import { Room } from './room';

const ha = new HomeAssistantRXJS();
// ha.entities.subscribe()
const room = new Room(ha);
room.motion$
  .pipe(
    distinctUntilChanged(),
    filter(state => state === 'on'),
    switchMapTo(room.turnOnCeilingLight()),
    delay(2000),
    switchMapTo(room.turnOffCeilingLight()),
  )
  .subscribe();
