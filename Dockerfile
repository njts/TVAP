FROM node:alpine

RUN addgroup -S app && adduser -S -g app app

WORKDIR /app

USER app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["npm", "run", "start"]



