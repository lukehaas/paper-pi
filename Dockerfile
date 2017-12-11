FROM ubuntu:16.04

RUN apt-get install libcairo2-dev libjpeg-dev libpango1.0-dev libgif-dev build-essential g++

WORKDIR /app
ADD . .

RUN yarn install
RUN yarn lint
RUN yarn test
CMD node ./bin/index.js
