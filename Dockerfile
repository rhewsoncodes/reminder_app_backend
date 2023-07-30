FROM node:alpine as base

WORKDIR .

COPY package.json package-lock.json ./

RUN rm -rf node_modules && npm install

COPY . .

CMD ["node", "./server.js"]