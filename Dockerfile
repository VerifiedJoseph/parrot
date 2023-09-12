FROM node:18.17.1-alpine3.18 as node
ENV PARROT_VERSION=1.7.4

LABEL org.opencontainers.image.description="Browser-based viewer for tweet archives created with the Twitter Media Downloader browser extension."
LABEL org.opencontainers.image.licenses=MIT
LABEL org.opencontainers.image.source=https://github.com/VerifiedJoseph/parrot

# Copy code
COPY ./ /app

WORKDIR /app

# Install git
RUN apk add git

# Install dependencies with npm
RUN npm ci

# Build webpack
RUN npm run build:prod

# Build zip
RUN node build/zip.js

FROM nginx:1.25.2-alpine3.18-slim

# Copy nginx config
COPY --chown=nobody --from=node /app/config/nginx.conf /etc/nginx/nginx.conf

# Copy code
COPY --chown=nobody  --from=node /app/dist/ /var/www/html/

# Make files accessable to nobody user
RUN chown -R nobody.nobody /run /var/www/html/

USER nobody
CMD nginx -g 'daemon off;'
