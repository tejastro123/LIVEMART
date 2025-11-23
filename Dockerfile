# Stage 1: Build the React Client
FROM node:18-alpine as client-build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# Stage 2: Setup the Node Server
FROM node:18-alpine
WORKDIR /app
COPY server/package*.json ./
RUN npm install --production
COPY server/ ./

# Copy the client build to the server's public directory (or where you serve static files)
# Assuming server serves from 'public' or you configure it to serve from 'client-build'
# For this setup, let's assume we copy to a 'public' folder in server
COPY --from=client-build /app/client/build ./public

# Expose the port the server runs on
EXPOSE 5000

# Command to run the server
CMD ["node", "index.js"]
