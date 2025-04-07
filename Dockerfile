FROM node:latest

WORKDIR /app

COPY . .

RUN npm install

RUN npm run build

EXPOSE 4000

ENTRYPOINT ["node", "./dist/src/index.js", "--mode:production"]
