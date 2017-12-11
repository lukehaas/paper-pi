FROM mhart/alpine-node:8

RUN apk add libcairo2-dev libjpeg8-dev libpango1.0-dev libgif-dev g++

WORKDIR /app
ADD . .

RUN yarn install
RUN yarn lint
RUN yarn test
CMD node ./bin/index.js
