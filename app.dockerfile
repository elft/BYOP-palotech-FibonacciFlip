FROM node:latest

WORKDIR /app

COPY src src
COPY public public
COPY .cta.json .cta.json
COPY package.json package.json
COPY package-lock.json package-lock.json
COPY tsconfig.json tsconfig.json
COPY tsr.config.json tsr.config.json
COPY .tanstack .tanstack

EXPOSE 3000