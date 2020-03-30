## Local build

docker build --build-arg BUILD_FROM="homeassistant/amd64-base:latest" -t ha-rxjs .

## Local run

docker run --rm -v /tmp/ha-rxjs:/data ha-rxjs
