# frontend/anti-scam-mobile/Dockerfile
# Use an official Node image as a base
FROM node:18-alpine

# Install expo-cli globally
RUN npm install -g expo

# Create app directory
WORKDIR /app

# Copy package.json and package-lock.json (if present)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app’s source code
COPY . .

# Expose the typical Expo ports
# 19000: Metro Bundler
# 19001: React Native for Web (if used)
# 19002: Dev tools
EXPOSE 8002 19000 19001 19002

# Set the default command to start Expo
# --tunnel is optional; you can use --host lan if you prefer
CMD ["expo", "start", "--host", "lan"]
