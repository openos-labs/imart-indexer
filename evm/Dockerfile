FROM node:18.13.0

WORKDIR /app/event-worker-evm

COPY package.json yarn.lock ./
RUN yarn install
COPY . .