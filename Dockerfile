FROM node:14.15-alpine AS builder

WORKDIR /app
COPY package* ./
RUN npm ci
COPY . .
RUN npm run build \
    && npm prune --production

FROM node:14.15-alpine

ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

WORKDIR /app
COPY --from=builder --chown=node:node /app ./

USER node

ARG PORT=3000
ENV PORT $PORT
EXPOSE $PORT 9229 9230

CMD ["node", "dist/main"]
