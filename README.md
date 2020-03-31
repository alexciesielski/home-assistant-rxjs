# home-assistant-rxjs

rxjs wrapper for [home-assistant-js-websocket](https://github.com/home-assistant/home-assistant-js-websocket)

## Getting started

### Local Development

`npm run dev`

### Local Docker Development

#### Local build

`docker build --build-arg BUILD_FROM="homeassistant/amd64-base:latest" -t ha-rxjs .`

#### Local run

`docker run --rm -e SUPERVISOR_TOKEN="<long-lived-access-token>" ha-rxjs`
