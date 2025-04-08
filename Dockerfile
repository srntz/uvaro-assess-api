FROM node:latest

WORKDIR /app

COPY . .

RUN chmod +x entrypoint.sh

RUN npm install

RUN npm run build

EXPOSE 4000

ENTRYPOINT ["sh","./entrypoint.sh"]
