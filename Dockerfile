FROM node:20-alpine AS build

ARG HUGEICONS_TOKEN
ENV HUGEICONS_TOKEN=${HUGEICONS_TOKEN}
WORKDIR /app

ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0

# Install dependencies using the lockfile for reproducibility.
COPY package.json yarn.lock .yarnrc.yml ./
RUN corepack enable \
    && yarn install --immutable

# Copy the remaining source and build the static site.
COPY . .
RUN yarn build

# Clear the token so it doesn't leak into later layers.
ENV HUGEICONS_TOKEN=

FROM nginx:1.27-alpine AS runtime

# Install curl for health checks and remove default nginx content.
RUN apk add --no-cache curl \
    && rm -rf /usr/share/nginx/html/*

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s \
  CMD curl -fsS http://127.0.0.1/ || exit 1
