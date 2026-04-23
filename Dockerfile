# --- build frontend ---
FROM node:18 AS frontend-build

WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

# --- build backend ---
FROM node:18 AS backend-build

WORKDIR /backend
COPY backend/package*.json ./
RUN npm install

COPY backend/ .

RUN npx prisma generate

# --- final image ---
FROM node:18

# install nginx
RUN apt update && apt install -y nginx

# copy backend
WORKDIR /backend
COPY --from=backend-build /backend ./backend

# copy frontend build to nginx html
COPY --from=frontend-build /frontend/dist /var/www/html

# copy nginx config
COPY nginx/default.conf /etc/nginx/sites-available/default

# expose ports
EXPOSE 80

# start both nginx and node
CMD service nginx start && node backend/src/server.js
