FROM node:20

WORKDIR /app
COPY . .
RUN apt-get update -y && apt-get install gettext-base -y && apt-get clean
RUN npm install
ENTRYPOINT ["/app/docker-entrypoint.sh"]