# home-assistant-rxjs

rxjs wrapper for [home-assistant-js-websocket](https://github.com/home-assistant/home-assistant-js-websocket)

## Getting started

1. `npm install @ciesielskico/home-assistant-rxjs`

2. Create long-lived access token under http://homeassistant:8123/profile

3. Create a `.env` file with two properties `HOST` and `ACCESS_TOKEN`.

```
HOST=http://homeassistant.local:8123
ACCESS_TOKEN=<long-lived-access-token>
```

4. Create a class that extends `HomeAssistantRXJS` and define your automations

```
import {
  delay,
  distinctUntilChanged,
  filter,
  switchMapTo,
} from 'rxjs/operators';
import { HomeAssistantRXJS, select } from '@ciesielskico/home-assistant-rxjs';

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
```

## Deploy as add-on on Home Assistant

1. Install the [Samba share](https://github.com/home-assistant/hassio-addons/tree/master/samba) add-on

2. Open the share under `\\192.168.x.<ha-ip>`

3. Create folder `ha-rxjs` inside `addons`

4. Copy `src`, `package.json`, `config.json`, `Dockerfile` and `run.sh`

5. In Home Assistant under Supervisor choose `Add-On Store`

6. Refresh (upper-right corner)

7. Install

8. Start add-on

## Development

Start Typescript dev server

`npm run dev`

### Local build

`docker build --build-arg BUILD_FROM="homeassistant/amd64-base:latest" -t ha-rxjs .`

### Local run

`docker run --rm --env-file=.env ha-rxjs`

## Known bugs

- app doesn't exit properly (probably to do with connection)
- require/imports esm throwing warnings
