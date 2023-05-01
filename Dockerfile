# Dockerfile for WHEREABOUTS API Server
# Build: docker build . -t whereabouts

# (note) for Apple M1 / Raspberry Pi builds, use lukechannings/deno:latest
FROM denoland/deno:latest

EXPOSE 8080

USER deno
WORKDIR /app
RUN mkdir ./src
COPY . .
RUN deno cache src/main.ts

CMD ["task", "startProd"]