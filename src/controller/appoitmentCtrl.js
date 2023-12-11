const pointment = require("../models/appointmentModel");
const asyncHandler = require("express-async-handler");
const Patient = require("../models/patientModel");
const Doctor = require("../models/doctorModel");

const createpointment = asyncHandler(async (req, res) => {
  try {
    const patient = await Patient.findById(req.body.patient);
    const doctor = await Doctor.findById(req.body.doctor);

    if (!patient) {
      throw new Error("Invalid patient ID");
    }

    if (!doctor) {
      throw new Error("Invalid doctor ID");
    }

    const existingAppointment = await pointment.findOne({
      date: req.body.date,
      time: req.body.time,
      timeSlot: req.body.timeSlot,
    });

    if (existingAppointment) {
      throw new Error("Time slot is already booked");
    }

    const newAppointment = await pointment.create({
      ...req.body,
      patient,
      doctor,
    });

    // Update doctor's appointments array
    await Doctor.findByIdAndUpdate(doctor.id, {
      $push: { appointments: newAppointment.id },
    });

    res.json(newAppointment);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
});

const getAllpointment = asyncHandler(async (req, res) => {
  try {
    const appointments = await pointment
      .find()
      .populate("patient")
      .populate("doctor");

    // Sắp xếp các lịch hẹn theo ngày, khung giờ và thời gian
    appointments.sort(compareAppointments);

    function compareAppointments(a, b) {
      // So sánh theo ngày trước
      if (a.date < b.date) {
        return -1;
      } else if (a.date > b.date) {
        return 1;
      } else {
        // Nếu ngày giống nhau, so sánh theo khung giờ
        const timeSlotOrder = ["morning", "afternoon", "evening"];
        const aTimeSlotIndex = timeSlotOrder.indexOf(a.timeSlot);
        const bTimeSlotIndex = timeSlotOrder.indexOf(b.timeSlot);

        if (aTimeSlotIndex < bTimeSlotIndex) {
          return -1;
        } else if (aTimeSlotIndex > bTimeSlotIndex) {
          return 1;
        } else {
          // Nếu cả ngày và khung giờ giống nhau, so sánh theo thời gian
          if (a.time < b.time) {
            return -1;
          } else if (a.time > b.time) {
            return 1;
          } else {
            // Nếu cả thời gian và ngày giống nhau, sắp xếp theo _id
            return a.id < b.id ? -1 : 1;
          }
        }
      }
    }

    res.json(appointments);
  } catch (error) {
    throw new Error(error);
  }
});

// nếu chẳng may để date là date không phải string , và time là string thì hãy dùng cái bên dưới

// Chat Gpt

// function convertTimeToInteger(timeString) {
//   const parts = timeString.split(":");
//   const hours = parseInt(parts[0]);
//   const minutes = parseInt(parts[1]);
//   return hours * 60 + minutes;
// }

// function compareAppointments(a, b) {
//   const aDate = new Date(a.date);
//   const bDate = new Date(b.date);

//   if (aDate < bDate) {
//     return -1; // So sánh theo ngày trước
//   } else if (aDate > bDate) {
//     return 1; // So sánh theo ngày trước
//   } else {
//     // Nếu ngày giống nhau, tiếp tục so sánh theo thời gian
//     const aTimeInt = convertTimeToInteger(a.time);
//     const bTimeInt = convertTimeToInteger(b.time);

//     if (aTimeInt < bTimeInt) {
//       return -1;
//     } else if (aTimeInt > bTimeInt) {
//       return 1;
//     } else {
//       // Nếu cả giờ và phút đều giống nhau, sắp xếp theo _id
//       return a.id < b.id ? -1 : 1;
//     }
//   }
// }

// Brad AI

// function compareAppointmentsByDateAndTime(a, b) {
//   const aDate = new Date(a.date);
//   const bDate = new Date(b.date);

//   if (aDate < bDate) {
//     return -1;
//   } else if (aDate > bDate) {
//     return 1;
//   } else {
//     // Hai lịch hẹn có cùng ngày
//     const aTime = a.time;
//     const bTime = b.time;

//     const aHour = aTime.split(":")[0];
//     const bHour = bTime.split(":")[0];

//     if (aHour < bHour) {
//       return -1;
//     } else if (aHour > bHour) {
//       return 1;
//     } else {
//       // Hai lịch hẹn có cùng ngày và giờ
//       const aMinute = aTime.split(":")[1];
//       const bMinute = bTime.split(":")[1];

//       if (aMinute < bMinute) {
//         return -1;
//       } else if (aMinute > bMinute) {
//         return 1;
//       } else {
//         // Hai lịch hẹn có cùng ngày, giờ và phút
//         return 0;
//       }
//     }
//   }
// }

const updatepointment = asyncHandler(async (req, res) => {
  const id = req.params.id;
  try {
    const updatepointment = await pointment.findOneAndUpdate(
      { _id: id },
      req.body,
      {
        new: true,
      }
    );
    res.json({ updatepointment });
  } catch (error) {
    throw new Error(error);
  }
});

const deletepoitment = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const deletepoitment = await pointment.findByIdAndDelete(id);
    res.json({ deletepoitment });
  } catch (error) {
    throw new Error(error);
  }
});

const getDatepointment = asyncHandler(async (req, res) => {
  try {
    const { date } = req.body;

    const appointments = await pointment.find({ date });

    if (appointments.length === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy lịch hẹn cho ngày đã chỉ định." });
    }

    // Sắp xếp danh sách lịch hẹn theo thời gian
    appointments.sort((a, b) => {
      const timeA = a.time;
      const timeB = b.time;
      if (timeA < timeB) {
        return -1;
      }
      if (timeA > timeB) {
        return 1;
      }
      return 0;
    });

    res.json(appointments);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createpointment,
  getAllpointment,
  updatepointment,
  deletepoitment,
  getDatepointment,
};
