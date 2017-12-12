FROM ubuntu:16.04

RUN apt-get update && apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_8.x | bash -
RUN apt-get install -y nodejs libcairo2-dev libjpeg8-dev libpango1.0-dev libgif-dev build-essential g++
RUN npm i -g yarn
RUN yarn install

WORKDIR /app
ADD . .

RUN yarn install
RUN yarn lint
RUN yarn test
CMD node ./bin/index.js
