FROM node:18.13.0

WORKDIR /app/indexer-pol

COPY package.json yarn.lock ./
RUN yarn install
COPY . .