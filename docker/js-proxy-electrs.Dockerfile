FROM node:14.13.1-stretch-slim

WORKDIR /app
RUN npm install --save express bitcoinjs-lib
ADD ./src ./src

CMD ["node", "src/server.js"]