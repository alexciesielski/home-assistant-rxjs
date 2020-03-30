#!/usr/bin/env bashio
set +u

CONFIG_PATH=/data/options.json
HOST=$(jq --raw-output ".host" $CONFIG_PATH)
TOKEN=$(jq --raw-output ".token" $CONFIG_PATH)

npm start --host "$HOST" --token "$TOKEN"