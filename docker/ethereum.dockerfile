FROM node:18.13.0

WORKDIR /app/event-worker-ethereum

COPY package.json yarn.lock ./
RUN yarn install
COPY . .