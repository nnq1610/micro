FROM node:22.0.0
LABEL authors="quang"

WORKDIR .
# Bundle app src
COPY . .
# Install app dependencies
RUN npm install
EXPOSE 3000
CMD [ "npm", "start" ]