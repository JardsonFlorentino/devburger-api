FROM node:20-alpine

WORKDIR /app

# Copy package and lockfiles for deterministic installs
COPY package.json yarn.lock ./

# Enable Corepack and install dependencies with Yarn
RUN corepack enable && corepack prepare yarn@stable --activate && \
    yarn install --frozen-lockfile --non-interactive

# Copy app sources
COPY . .

EXPOSE 3001

# Start server (migrations run via Fly release command)
CMD ["yarn", "start"]