# Dockerfile

FROM node:18-alpine
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000
ENV NODE_ENV=production

CMD ["node", "src/app.js"]
