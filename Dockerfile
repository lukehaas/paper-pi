FROM ubuntu:16.04

RUN apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 0C49F3730359A14518585931BC711F9BA15703C6 \
  #&& echo "deb [ arch=amd64,arm64 ] http://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.4 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-3.4.list \
  && apt-get update \
  && apt-get install -y curl \
  && curl -sL https://deb.nodesource.com/setup_8.x | bash - \
  && apt-get install -y nodejs libcairo2-dev libjpeg8-dev libpango1.0-dev libgif-dev build-essential g++ \
  && apt-get clean

WORKDIR /app
ADD . .

RUN npm ci
#VOLUME /data/db
EXPOSE 8080

CMD npm start
