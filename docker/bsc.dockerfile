FROM node:18.13.0

WORKDIR /app/indexer-bsc

COPY package.json yarn.lock ./
RUN yarn install
COPY . .