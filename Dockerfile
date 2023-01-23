FROM node:alpine

RUN addgroup app && adduser -S -G app app

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

USER app

EXPOSE 3000

CMD ["npm", "run", "start"]






