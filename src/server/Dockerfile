FROM jrottenberg/ffmpeg:3.4-alpine
FROM node


COPY --from=0 / /

RUN npm install -g nodemon

RUN mkdir -p /app/server
WORKDIR /app/server

COPY package.json /app/server/

RUN npm install

COPY . /app/server/

CMD ["nodemon", "server.js"]