FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY index.html ./
COPY postcss.config.js ./
COPY tailwind.config.js ./
COPY vite.config.ts ./
COPY src ./src
COPY tsconfig.json ./
RUN npm run build

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
