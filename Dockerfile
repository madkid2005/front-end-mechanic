# Dockerfile

# 1. Base image
FROM node:18-alpine

# 2. Set working directory
WORKDIR /app

# 3. Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# 4. Copy the rest of the code
COPY . .

# 5. Disable type checking and ESLint during build (inline)
RUN NEXT_DISABLE_ESLINT=true NEXT_DISABLE_TYPE_CHECKING=true npm run build

# 6. Build Next.js
RUN npm run build

# 7. Expose and start
EXPOSE 3000
CMD ["npm", "start"]
