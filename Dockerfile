# syntax=docker/dockerfile:1.7

FROM node:20-alpine AS build

WORKDIR /app

ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0

# Install dependencies using the lockfile for reproducibility.
COPY package.json yarn.lock .yarnrc.yml ./
RUN --mount=type=secret,id=hugeicons_token \
  set -eux; \
  printf "HUGEICONS_TOKEN=%s\n" "$(cat /run/secrets/hugeicons_token)" > .env; \
  corepack enable; \
  yarn install --immutable; \
  rm -f .env

# Copy the remaining source and build the static site.
COPY . .
RUN --mount=type=secret,id=hugeicons_token \
  set -eux; \
  printf "HUGEICONS_TOKEN=%s\n" "$(cat /run/secrets/hugeicons_token)" > .env; \
  yarn build; \
  rm -f .env

FROM nginx:1.27-alpine AS runtime

# Install curl for health checks and remove default nginx content.
RUN apk add --no-cache curl \
    && rm -rf /usr/share/nginx/html/*

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s \
  CMD curl -fsS http://127.0.0.1/ || exit 1
