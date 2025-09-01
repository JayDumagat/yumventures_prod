FROM node:18 AS build

WORKDIR /app
COPY package*.json ./
RUN npm install --only=production
COPY . .

FROM node:18 AS runtime
WORKDIR /app
COPY --from=build /app /app
EXPOSE 3000
CMD ["node", "server.js"]
