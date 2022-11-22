FROM node:18.12.1 as build

WORKDIR /

COPY package*.json ./

RUN npm install -g npm@9.1.2
RUN npm install

COPY . .

RUN npm run build
RUN npm pack

FROM node:14.17.5-alpine

WORKDIR /

ENV NODE_ENV=production

COPY --from=build /person-*.tgz .

RUN npm i -g --omit person-*.tgz

USER node

ENTRYPOINT ["person-service-js"]
