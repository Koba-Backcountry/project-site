# --- build backend ---
FROM node:18 AS backend-build

WORKDIR /backend

COPY package*.json ./
RUN npm install

COPY . .

# Prisma generate
RUN npx prisma generate --schema=./prisma/schema.prisma


# --- final image ---
FROM node:18

WORKDIR /backend
COPY --from=backend-build /backend ./

EXPOSE 3000

CMD npx prisma db push && node src/server.js
