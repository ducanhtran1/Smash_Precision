# Build from repository root (monorepo Yarn workspaces):
#   docker build -f backend/Dockerfile -t smash-precision-api .
#
# Run:
#   docker run --env-file backend/.env -p 3001:3001 smash-precision-api

FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

RUN yarn install --frozen-lockfile

COPY backend ./backend

RUN yarn workspace backend build

FROM node:20-alpine AS production

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3001

COPY package.json yarn.lock ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

RUN yarn install --frozen-lockfile --production=true

COPY --from=builder /app/backend/dist ./backend/dist

EXPOSE 3001

CMD ["node", "backend/dist/main.js"]
