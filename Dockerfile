FROM node:20.12.1-alpine3.19 as node
ENV PARROT_VERSION=1.8.6

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

FROM alpine:3.19.1

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
