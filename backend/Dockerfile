FROM node:20-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml tsconfig.json ./

RUN pnpm install --frozen-lockfile

COPY src ./src

RUN pnpm run build

FROM node:20-alpine

RUN npm install -g pnpm && apk add --no-cache curl netcat-openbsd

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile --prod

COPY --from=builder /app/dist ./dist
COPY wait-for-mysql.sh ./wait-for-mysql.sh

RUN chmod +x ./wait-for-mysql.sh

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["./wait-for-mysql.sh"]