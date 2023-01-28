FROM node:alpine

RUN addgroup app && adduser -S -G app app

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

RUN mkdir /app/logs

RUN chmod -R 660 /app/logs && chown -R app:app /app/logs

USER app

EXPOSE 3000

CMD ["npm", "run", "start"]
