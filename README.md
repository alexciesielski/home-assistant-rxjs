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

4. Initialize `HomeAssistantRXJS` and define your automations

```
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
