FROM node:alpine as build

RUN addgroup tvap && adduser -S -G tvap tvap

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN chown -R tvap:tvap /app

USER tvap

RUN npm run build

FROM node:alpine

RUN addgroup tvap && adduser -S -G tvap tvap

WORKDIR /app

COPY --from=build /app/dist /app

EXPOSE 3000

USER tvap

CMD ["npm", "start"]






