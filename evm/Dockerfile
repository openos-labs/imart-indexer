FROM node:18.13.0

WORKDIR /app/event-worker-evm

COPY package.json package-lock.json ./
RUN npm install
COPY . .