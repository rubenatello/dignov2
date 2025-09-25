# Dockerfile for Next.js frontend
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install useful debug utilities (curl optional)
RUN apk add --no-cache curl bash

# Create non-root user to avoid permission clashes with bind mounts on host
RUN addgroup -g 1001 -S nodejs \
	&& adduser -S nextjs -u 1001 -G nodejs

# Copy dependency manifests first (better layer caching)
COPY package*.json ./

# Install dependencies (frozen lockfile if present)
RUN npm install --legacy-peer-deps

# Copy the rest of the app
COPY . .
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Ensure ownership for the non-root user (important for writing .next, .turbo, etc.)
RUN chown -R nextjs:nodejs /app

# Environment defaults (can be overridden by docker-compose)
ENV HOST=0.0.0.0 \
		PORT=3000 \
		NODE_ENV=development \
		NEXT_TELEMETRY_DISABLED=1 \
		WATCHPACK_POLLING=true

# Switch to non-root user
USER nextjs

# Expose Next.js dev port
EXPOSE 3000

# Use "dev"; docker-compose already sets command but keep a default
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
CMD ["npm", "run", "dev"]
