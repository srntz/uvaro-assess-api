FROM node:latest

WORKDIR /app

COPY . .

RUN npm install

RUN npm run build

RUN npm run sentry:sourcemaps

EXPOSE 4000

CMD ["npm", "run", "prod"]
