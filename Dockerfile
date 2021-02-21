FROM node:14

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

RUN git clone https://github.com/vishnubob/wait-for-it.git

COPY . .