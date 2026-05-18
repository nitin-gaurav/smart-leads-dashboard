FROM node:18-alpine

WORKDIR /app

COPY package.json ./
RUN npm install

COPY src ./src
COPY tsconfig.json ./
RUN npm run build

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]
