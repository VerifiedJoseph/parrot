FROM node:20.10.0-alpine3.18 as node
ENV PARROT_VERSION=1.8.4

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
RUN npm run build

FROM alpine:3.19.0

# Install nginx
RUN apk add --no-cache nginx

# Copy nginx config
COPY --chown=nobody --from=node /app/config/nginx.conf /etc/nginx/nginx.conf

# Copy code
COPY --chown=nobody --from=node /app/dist/ /var/www/html/

# Make files accessable to nobody user
RUN chown -R nobody.nobody /run /var/www/html/ /var/lib/nginx /var/log/nginx

USER nobody
CMD nginx -g 'daemon off;'
