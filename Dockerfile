FROM node:16

ENV PORT 3000

WORKDIR /usr/app/
COPY ./ ./

WORKDIR /usr/app/
RUN npm install

# Building app
RUN npm run build
EXPOSE 3000

# Running the app
CMD "npm" "start"