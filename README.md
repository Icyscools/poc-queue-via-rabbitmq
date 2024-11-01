# poc-queue-via-rabbitmq

## Prerequisite

You need Docker to be install in your local environment to install RabbitMQ. You also Node.js >20 and bun to run producers and consumers services.

## Install dependencies

```
bun i
```

## Running

Before run the producer and consumers services. Start RabbitMQ service via docker compose by
```
docker compose up -d
```

Then starts the producer and consumers services by
```
bun run dev
```