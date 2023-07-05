FROM node:20

WORKDIR /app
COPY . .
RUN apt-get update -y && apt-get upgrade -y && apt-get install libc++1 -y && apt-get clean
RUN npm install
ENTRYPOINT ["npm", "run", "docker"]