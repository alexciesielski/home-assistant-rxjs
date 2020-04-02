# home-assistant-rxjs

rxjs wrapper for [home-assistant-js-websocket](https://github.com/home-assistant/home-assistant-js-websocket)

## Getting started

### Local Development

1. Create long-lived access token under http://homeassistant:8123/profile

2. Create a `.env` file with two properties `HOST` and `ACCESS_TOKEN`.

```
HOST=http://homeassistant.local:8123
ACCESS_TOKEN=<long-lived-access-token>
```

3. Run the development server

```
npm run dev
```

#### Local build

`docker build --build-arg BUILD_FROM="homeassistant/amd64-base:latest" -t ha-rxjs .`

#### Local run

`docker run --rm --env-file=.env ha-rxjs`

## Known bugs

- app doesn't exit properly (probably to do with connection)
- require/imports esm throwing warnings
