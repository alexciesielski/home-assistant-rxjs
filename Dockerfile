ARG BUILD_FROM
FROM $BUILD_FROM

ENV LANG C.UTF-8

COPY run.sh /
WORKDIR /usr/
COPY example example
COPY lib lib
COPY package.json package-lock.json tsconfig.json config.json ./


# Setup base
RUN apk add --no-cache jq nodejs npm
RUN npm install \
        --no-audit \
        --no-update-notifier \
        --unsafe-perm

RUN chmod a+x /run.sh
CMD ["/run.sh"]
