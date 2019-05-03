FROM node:8

RUN mkdir -p /app/client

WORKDIR /app/client

COPY . /app/client/

RUN npm install -g webpack-dev-server
RUN npm install

CMD ["npm", "start"]