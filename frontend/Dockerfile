# Dockerfile for Next.js frontend
FROM node:20-alpine
WORKDIR /app

# Install curl for debugging
RUN apk add --no-cache curl

COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]
