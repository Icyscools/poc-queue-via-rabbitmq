import { Elysia } from "elysia";
import amqplib from "amqplib";

const exchangeName = "exchange-1";
const queueName = "queue-1";
const rabbitmqURL = "amqp://localhost";

const rabbitChannel = amqplib
  .connect(rabbitmqURL)
  .then((conn) => conn.createChannel());

const PRODUCER_PORT = Bun.env.PRODUCER_PORT;

const app = new Elysia()
  .get("/send", ({ query: { msg } }) => {
    if (!msg) return "No message";

    return rabbitChannel
      .then((ch) => {
        // ch.assertExchange(exchangeName, "direct");
        ch.sendToQueue(queueName, Buffer.from(msg), {});
        return "done";
      })
      .catch((err) => {
        return "Error\n" + err;
      });
  })
  .listen(PRODUCER_PORT);

console.log(`Producer is running at on port ${app.server?.port}...`);
