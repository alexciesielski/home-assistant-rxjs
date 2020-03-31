#!/usr/bin/with-contenv bashio

CONFIG_PATH=./data/options.json
TOKEN=$(jq --raw-output ".token" $CONFIG_PATH)

node -v
npm -v

# Remove exports property from package.json
#HAJSWEBSOCKETPKG=./node_modules/home-assistant-js-websocket/package.json
# echo $(cat $HAJSWEBSOCKETPKG | jq 'del(.exports)') > $HAJSWEBSOCKETPKG

echo $SUPERVISOR_TOKEN

npm run build
node dist/example/index.js --token="${SUPERVISOR_TOKEN}"