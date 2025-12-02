# franken-inn-ui/Dockerfile

# 1) Build stage
FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build the static assets
RUN npm run build

# 2) Runtime stage - nginx serving static files
FROM nginx:alpine

# Copy build output to nginx html directory
COPY --from=build /app/dist /usr/share/nginx/html

# Optional: custom nginx config
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
