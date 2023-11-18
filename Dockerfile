FROM node:14.17.5-alpine
EXPOSE 3000
RUN mkdir /app
WORKDIR /app
COPY package.json /app
RUN npm install --force
COPY . /app
CMD ["npm", "start"]