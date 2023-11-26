FROM node:alpine as base

WORKDIR .

COPY package.json package-lock.json ./

RUN npm install

COPY . .

CMD ["node", "./server.js"]