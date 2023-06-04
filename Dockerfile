# Dockerfile for the WHEREABOUTS API Server
# Build: docker build . -t abiddiscombe/whereabouts:semver

FROM denoland/deno:latest

EXPOSE 8080

USER deno
WORKDIR /app
RUN mkdir ./src
COPY . .
RUN deno cache src/main.ts

CMD ["task", "startProd"]