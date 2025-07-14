FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm install

COPY . .

# Set user to root temporarily
USER root

# Change permissions
# RUN chown -R 10014:10014 /app


# Build the app
RUN npm run build
# Switch back to non-root user
USER 10014

EXPOSE 3000

CMD ["npm", "start"]
