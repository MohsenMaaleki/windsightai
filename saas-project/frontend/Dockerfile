FROM node:14 as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY cloudflare.conf /etc/nginx/conf.d/cloudflare.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]