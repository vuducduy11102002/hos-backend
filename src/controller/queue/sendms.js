const amqplib = require("amqplib");

const amqp_url_cloud = process.env.AMQP_URL_CLOUD_MQ;

const sendMessageToRabbitMQ = async (message) => {
  try {
    // 1. create Connection
    const connection = await amqplib.connect(amqp_url_cloud);
    // 2 .create channel
    const channel = await connection.createChannel();
    // 3. create queue
    const nameExchange = "appointmentExchange"; // Tên exchange
    const routingKey = ""; // Key định tuyến

    // Khai báo exchange với loại "fanout"
    await channel.assertExchange(nameExchange, "fanout", { durable: true });
    // 4 . publish message

    // Gửi tin nhắn đến exchange với key định tuyến (nếu có)
    channel.publish(
      nameExchange,
      routingKey,
      Buffer.from(JSON.stringify(message)),
      { persistent: false }
    );

    console.log(`Message sent to RabbitMQ: ${JSON.stringify(message)}`);

    // await channel.close();
    // await connection.close();
  } catch (error) {
    console.error("Error sending message to RabbitMQ:", error);
  }
};

module.exports = {
  sendMessageToRabbitMQ,
};

// const message = process.argv[2].slice(" ") || "Hello Exchange!";
// sendMessageToRabbitMQ(message);
