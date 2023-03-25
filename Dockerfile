# FROM node:18-alpine
FROM --platform=linux/amd64 node:lts-alpine as builder

ENV APP_PATH /usr/src/app

WORKDIR $APP_PATH

COPY yarn.lock $APP_PATH
COPY package.json $APP_PATH

RUN yarn install

COPY . $APP_PATH
RUN yarn nest build

FROM nginx:stable-alpine

COPY ./nginx/nginx.conf /etc/nginx/nginx.conf

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /usr/src/app/dist /usr/share/nginx/html

EXPOSE 55555 80

RUN adduser --disabled-password --no-create-home john-doe

ENTRYPOINT ["nginx", "-g", "daemon off;"]

RUN chown john-doe:john-doe /var/cache/nginx/ && chown john-doe:john-doe -R /var/run/

USER john-doe
