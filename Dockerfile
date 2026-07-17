FROM node:22.11.0 AS base
WORKDIR /app
COPY package.json .

FROM base AS dev
RUN npm install
COPY . .
CMD ["npm", "start"]

FROM base AS prod
RUN npm install --only=production
COPY . .
CMD ["npm", "start"]