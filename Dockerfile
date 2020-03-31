ARG BUILD_FROM
FROM $BUILD_FROM

ENV LANG C.UTF-8

# Copy data for add-on
COPY run.sh /
#COPY data /data/

WORKDIR /usr/src/
COPY . .

# Setup base
RUN apk add --no-cache jq curl nodejs npm
RUN npm i

RUN chmod a+x /run.sh
CMD ["/run.sh"]
