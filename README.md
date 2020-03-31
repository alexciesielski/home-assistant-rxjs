# home-assistant-rxjs

rxjs wrapper for [home-assistant-js-websocket](https://github.com/home-assistant/home-assistant-js-websocket)

## Getting started

### Local Development

1. Create a `.env` file with two properties `HOST` and `ACCESS_TOKEN`.

```
HOST=http://homeassistant.local:8123
ACCESS_TOKEN=<long-lived-access-token>
```

2. Run the development server

```
npm run dev
```

#### Local build

`docker build --build-arg BUILD_FROM="homeassistant/amd64-base:latest" -t ha-rxjs .`

#### Local run

`docker run --rm --env-file=.env ha-rxjs`
