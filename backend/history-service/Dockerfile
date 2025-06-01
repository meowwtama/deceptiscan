FROM node:18-alpine

# 1. Create & set working directory
WORKDIR /app

# 2. Copy dependencies and install
COPY package*.json ./
RUN npm install --production

# 3. Copy source code, .env, and service account JSON
COPY . .

# 4. Expose the port (matching PORT in .env)
EXPOSE 8004

# 5. Start the service
CMD ["node", "app.js"]