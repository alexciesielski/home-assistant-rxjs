# Home Assistant JS Websocket + RXJS = home-assistant-rxjs

## Getting started

### Local Development

`npm run dev`

### Local Docker Development

#### Local build

`docker build --build-arg BUILD_FROM="homeassistant/amd64-base:latest" -t ha-rxjs .`

#### Local run

`docker run --rm -v /data:/data ha-rxjs`
