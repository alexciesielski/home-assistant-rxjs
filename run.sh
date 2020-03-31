#!/usr/bin/with-contenv bashio

# echo $SUPERVISOR_TOKEN

node -v
npm -v

npm run build

CONFIG_PATH=./data/options.json
if test -f "$CONFIG_PATH"; then
    echo "$CONFIG_PATH exists"
    TOKEN=$(jq --raw-output ".token" $CONFIG_PATH)
    
    node -r esm dist/example/index.js --token="$TOKEN"
else
    node -r esm dist/example/index.js
fi


# Remove exports property from package.json
#HAJSWEBSOCKETPKG=./node_modules/home-assistant-js-websocket/package.json
# echo $(cat $HAJSWEBSOCKETPKG | jq 'del(.exports)') > $HAJSWEBSOCKETPKG
