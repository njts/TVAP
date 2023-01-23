FROM node:alpine as build

RUN addgroup -S app && adduser -S -g app app

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

# second stage
FROM node:alpine

USER app

WORKDIR /app

COPY --from=build /app/package*.json ./

RUN npm ci --only=production

COPY --from=build /app/dist ./dist

EXPOSE 3000

CMD ["npm", "run", "start"]


