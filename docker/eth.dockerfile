FROM node:18.13.0

WORKDIR /app/indexer-eth

COPY package.json yarn.lock ./
RUN yarn install
COPY . .