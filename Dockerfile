FROM centos:centos6

RUN curl -sL https://rpm.nodesource.com/setup_8.x | bash -
RUN yum install -y nodejs cairo cairo-devel libjpeg-turbo-devel pango pango-devel giflib-devel
RUN npm i -g yarn
RUN yarn install

WORKDIR /app
ADD . .

RUN yarn install
RUN yarn lint
RUN yarn test
CMD node ./bin/index.js
