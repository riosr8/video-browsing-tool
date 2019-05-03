FROM node


RUN npm install -g nodemon


RUN mkdir -p /app/processingServer
WORKDIR /app/processingServer


COPY package.json /app/processingServer/


RUN npm install


COPY . /app/processingServer/


CMD ["nodemon", "processesor.js"]