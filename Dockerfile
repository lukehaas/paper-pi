FROM mhart/alpine-node:8

WORKDIR /app
ADD . .

RUN yarn install
RUN yarn lint
RUN yarn test
CMD node ./bin/index.js
