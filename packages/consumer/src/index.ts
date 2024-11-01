import cluster from "node:cluster";
import { availableParallelism } from "node:os";
import amqplib from "amqplib";

const exchangeName = "exchange-1";
const queueName = "queue-1";
const rabbitmqURL = "amqp://localhost";

const MAX_PARALLE_PROCESS = 4;
const availableParalled = Math.min(MAX_PARALLE_PROCESS, availableParallelism());

function createListenerWorker() {
  const rabbitChannel = amqplib
    .connect(rabbitmqURL)
    .then((conn) => conn.createChannel());

  rabbitChannel
    .then((ch) => {
      // ch.assertExchange(exchangeName, "direct");
      ch.assertQueue(queueName);

      // consume one process at a time.
      ch.prefetch(1);
      ch.consume(
        queueName,
        (msg) => {
          if (msg) {
            console.log(`${process.pid} get message: ${msg?.content}`);
            setTimeout(() => {
              ch.ack(msg);
            }, 10000);
          }
        },
        // no acknowldge the consume message
        { noAck: false }
      );
    })
    .catch((err) => {
      return "Error\n" + err;
    });
}

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < availableParalled; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  createListenerWorker();
  console.log(`Worker ${process.pid} started`);
}
