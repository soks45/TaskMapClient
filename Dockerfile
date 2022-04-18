FROM node:16

WORKDIR /TaskMapClient

COPY package*.json ./

RUN npm install

COPY . .

CMD [ "npm", "start" ]
