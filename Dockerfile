FROM node:7.5-slim

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install && npm cache clean

# Bundle app source
COPY . /usr/src/app

# Run Webpack build
RUN npm run build

EXPOSE 3000

CMD [ "node", "server.js" ]
