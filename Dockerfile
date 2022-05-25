FROM node:16
WORKDIR /TaskMapClient

COPY package*.json ./
RUN npm install

COPY . .
CMD [ "npm", "start" ]

FROM nginx:1.17.1-alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY /dist/task-map-client /usr/share/nginx/html
