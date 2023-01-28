FROM node:alpine

RUN addgroup app && adduser -S -G app app

WORKDIR /app

RUN mkdir /app/logs && chmod -R 660 /app/logs && chown -R app:app /app/logs

COPY package*.json ./

RUN npm ci --only=production

COPY . .

USER app

EXPOSE 3000

CMD ["npm", "run", "start"]
