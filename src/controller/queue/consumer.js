const amqplib = require("amqplib");

const amqp_url_cloud = process.env.AMQP_URL_CLOUD_MQ;

const receiveMessage = async () => {
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
    // 4 . create message
    const { queue } = await channel.assertQueue("", { exclusive: true });

    console.log(`${queue}`);
    // 5. bingding
    await channel.bindQueue(queue, nameExchange, routingKey);

    // 6. receive message
    await channel.consume(
      queue,
      (message) => {
        const data = JSON.parse(message.content.toString());
        // Xử lý tin nhắn theo loại
        switch (data.type) {
          case "newAppointment":
            console.log("Received new appointment:", data.appointment);
            // Xử lý mới cuộc hẹn tại đây
            break;
          // Các trường hợp khác nếu có
          default:
            console.log("Received conflicting appointment:", data.appointment);
        }
      },
      {
        noAck: true,
      }
    );
  } catch (error) {
    console.error("Error receiving message from RabbitMQ:", error);
  }
};

receiveMessage();
// module.exports = {
//   receiveMessage,
// };
