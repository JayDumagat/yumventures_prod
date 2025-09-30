FROM node:18 AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build  # Builds static files
# Use nginx to serve the static files
FROM nginx:latest
COPY --from=build /app/dist /usr/share/nginx/html