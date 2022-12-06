ARG NODE_VERSION=18.12.1-alpine3.16
ARG NGINX_VERSION=1.23.2-alpine

LABEL org.opencontainers.image.description="Browser-based viewer for tweet archives created with the Twitter Media Downloader browser extension."
LABEL org.opencontainers.image.licenses=MIT
LABEL org.opencontainers.image.source=https://github.com/VerifiedJoseph/parrot

FROM node:${NODE_VERSION} as node

# Copy code
COPY ./ /app

WORKDIR /app

# Install git
RUN apk add git

# Install dependencies with npm
RUN npm ci

# Build webpack
RUN npm run build

# Build zip
RUN node build/zip.js

FROM nginx:${NGINX_VERSION}

# Copy nginx config
COPY --from=node /app/config/nginx.conf /etc/nginx/nginx.conf

# Copy code
COPY --chown=nginx --from=node /app/dist/ /var/www/html/
