# Dockerfile for WHEREABOUTS API Server
# Build: docker build . -t abiddiscombe/whereabouts:semver

# For ARM64 (Apple M1, Raspberry Pi) builds
FROM denoland/deno:latest

EXPOSE 8080

USER deno
WORKDIR /app
RUN mkdir ./src
COPY . .
RUN deno cache src/main.ts

CMD ["task", "startProd"]