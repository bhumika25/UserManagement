FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install && npm ls @fastify/swagger


COPY . .
COPY .env .env

RUN npx prisma generate

RUN npm run build

EXPOSE 3000

CMD ["node", "dist/server.js"]

