FROM node:16-alpine as build
WORKDIR /app/src
COPY package*.json ./
RUN npm ci
COPY angular.json ./
COPY proxy.conf.json ./
COPY tsconfig.json ./
COPY tslint.json ./
COPY src ./src
RUN npm run build

FROM nginx:1.13.3-alpine
RUN rm -rf /usr/share/nginx/html/*
RUN rm -rf /etc/nginx/conf.d/*
COPY nginx/docker.conf /etc/nginx/conf.d/
COPY --from=build /app/src/wwwroot /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]
EXPOSE 8085