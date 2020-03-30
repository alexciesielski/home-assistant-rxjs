#!/usr/bin/with-contenv bashio
ls

CONFIG_PATH=./data/options.json
HOST=$(jq --raw-output ".host" $CONFIG_PATH)
TOKEN=$(jq --raw-output ".token" $CONFIG_PATH)

node -v
npm -v

npm run build
node dist/index.js '--host="$HOST"' '--token="$TOKEN"'