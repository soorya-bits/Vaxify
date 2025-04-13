FROM node:16-alpine

WORKDIR /frontend

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000
CMD ["npx", "serve", "build"]