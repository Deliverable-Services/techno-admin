# Build stage
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy built app
COPY --from=build /app/build ./build

# Copy public folder for static assets
COPY --from=build /app/public ./public

# Expose port 3000
EXPOSE 3000

# Start the app
CMD ["npm", "run", "start"]
