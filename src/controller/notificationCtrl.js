const nodemailer = require("nodemailer");
const asyncHandler = require("express-async-handler");
const RequestAppointment = require("../models/notificationModel");
const Doctor = require("../models/doctorModel");
const Appointment = require("../models/appointmentModel");
const { sendMessageToRabbitMQ } = require("./queue/sendMS");

const sendNotification = asyncHandler(async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.body.doctor);

    if (!doctor) {
      throw new Error("Invalid doctor ID");
    }
    const existingRequestAppointment = await RequestAppointment.findOne({
      email: req.body.email,
    });

    if (existingRequestAppointment) {
      const message = "Appointment request with this email already exists";
      return res.status(400).json({ errorType: "emailConflict", message });
    }

    // Xác định thông tin ngày và khung giờ của cuộc hẹn mới
    const newAppointmentDate = req.body.date;
    const newAppointmentTime = req.body.time;
    const newAppointmentTimeSlot = req.body.timeSlot;

    // Truy vấn tất cả các cuộc hẹn của bác sĩ trong ngày đó và khung giờ đó
    const existingAppointments = await Appointment.find({
      doctor: doctor.id,
      date: newAppointmentDate,
      time: newAppointmentTime,
      timeSlot: newAppointmentTimeSlot,
    });

    // Kiểm tra trùng lịch
    if (existingAppointments.length > 0) {
      // Có trùng lịch, gửi tin nhắn đến RabbitMQ hoặc xử lý theo ý bạn
      const message = {
        type: "appointmentConflict",
        appointment: req.body,
      };
      sendMessageToRabbitMQ(message);

      return res
        .status(400)
        .json({ errorType: "appointmentConflict", message });
    } else {
      // không trùng lịch, tạo một lịch hẹn và gửi tin nhắn đến RabbitMQ
      const requestAppointment = await RequestAppointment.create(req.body);
      await requestAppointment.save();

      const newAppointmentMessage = {
        type: "newAppointment",
        appointment: req.body,
      };

      // Gửi tin nhắn đến RabbitMQ
      sendMessageToRabbitMQ(newAppointmentMessage);

      // Cập nhật trạng thái đã gửi cho bác sĩ
      await doctor.save();
    }

    // Gửi email thông báo
    const emailOptions = {
      from: "hospital@example.com",
      to: "so7ngovanso@gmail.com", // Thay đổi địa chỉ email nhận thông báo
      subject: "New Appointment Request",
      html: `
        <p>New appointment request:</p>
        <p>Doctor: ${doctor.name}</p>
        <p>Date: ${newAppointmentDate}</p>
        <p>Time: ${newAppointmentTime}</p>
      `,
    };

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.MAIL_ID,
        pass: process.env.MP,
      },
    });

    await transporter.sendMail(emailOptions);

    res.json({ message: "Appointment request saved successfully." });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
});

const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await RequestAppointment.find().populate("doctor");
  res.json(notifications);
});

module.exports = {
  sendNotification,
  getNotifications,
};
