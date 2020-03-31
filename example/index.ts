import dotenv from 'dotenv';
import { filter, take, tap } from 'rxjs/operators';
import { HomeAssistantRXJS } from '../lib';

dotenv.config();
const host = process.env.HOST ?? 'http://homeassistant:8123';
const token = process.env.ACCESS_TOKEN;

if (!token) {
  throw new Error(
    'No access token (SUPERVISOR_TOKEN or ACCESS_TOKEN) found in environment variables.',
  );
}

console.log(`Initializing HA with ${token} at ${host}`);
const harxjs = new HomeAssistantRXJS(host, token);

harxjs.services$
  .pipe(
    filter(config => Object.keys(config).length > 0),
    take(1),
    tap(console.log),
    tap(() => harxjs.destroy()),
  )
  .subscribe();
