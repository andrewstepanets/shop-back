FROM node:16-alpine as base
COPY . .
RUN npm install && npm cache clean --force
USER node
EXPOSE 3000
ENTRYPOINT ["node", "src/handler.js"]
