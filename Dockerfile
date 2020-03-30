ARG BUILD_FROM
FROM $BUILD_FROM

ENV LANG C.UTF-8


# Copy data for add-on
COPY run.sh /
RUN chmod a+x /run.sh

WORKDIR /usr/src/
COPY package.json package-lock.json tsconfig.json src ./

# Set shell
# SHELL ["/bin/bash", "-o", "pipefail", "-c"]

# Setup base
RUN apk add --no-cache jq nodejs npm

    # \
    # && npm config set unsafe-perm true \
    # \
    # && npm install \
    #     --no-audit \
    #     --no-optional \
    #     --no-update-notifier \
    #     --only=production \
    #     --unsafe-perm
    # \
    # && npm cache clear --force \
    # \
    # && apk del --no-cache --purge .build-dependencies \
    # && rm -fr \
    #     /tmp/* \
    #     /etc/nginx

RUN npm i

# WORKDIR /
CMD ["/run.sh"]

# CMD ["npm", "start", "--token", "${SUPERVISOR_TOKEN}"]