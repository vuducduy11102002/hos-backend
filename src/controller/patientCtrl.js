const Patient = require("../models/patientModel");
const asyncHandler = require("express-async-handler");

const createPatient = asyncHandler(async (req, res) => {
  try {
    const newPatient = await Patient.create(req.body);
    res.json(newPatient);
  } catch (error) {
    throw new Error(error);
  }
});

// All patients

// const getAllPatient = asyncHandler(async (req, res) => {
//   try {
//     const getAllPatient = await Patient.find({});

//     getAllPatient.sort(allPatient);
//     function allPatient(a, b) {
//       // So sánh theo ngày trước
//       if (a.Admission > b.Admission) {
//         return -1;
//       } else if (a.Admission < b.Admission) {
//         return 1;
//       } else {
//         // Nếu ngày giống nhau, so sánh theo thời gian
//         if (a.Admission > b.Admission) {
//           return -1;
//         } else if (a.Admission < b.Admission) {
//           return 1;
//         } else {
//           // Nếu cả thời gian và ngày giống nhau, sắp xếp theo _id
//           return a.id > b.id ? -1 : 1;
//         }
//       }
//     }
//     res.json(getAllPatient);
//   } catch (error) {
//     throw new Error(error);
//   }
// });
const getAllPatient = asyncHandler(async (req, res) => {
  try {
    const allPatients = await Patient.find({
      deletedAt: {
        $eq: null,
      },
    }).sort({ Admission: -1, _id: -1 });
    res.json(allPatients);
  } catch (error) {
    throw new Error(error);
  }
});
const getSoftPatient = asyncHandler(async (req, res) => {
  try {
    const softDeletedPatients = await Patient.find({
      deletedAt: {
        $ne: null,
      },
    }).sort({ Admission: -1, _id: -1 });
    res.json(softDeletedPatients);
  } catch (error) {
    throw new Error(error);
  }
});

const getaPatient = asyncHandler(async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);

    res.json(patient);
  } catch (error) {
    throw new Error(error);
  }
});

const updatePatient = asyncHandler(async (req, res) => {
  const id = req.params.id;
  try {
    const updatePatient = await Patient.findOneAndUpdate(
      { _id: id },
      req.body,
      {
        new: true,
      }
    );
    res.json({ updatePatient });
  } catch (error) {
    throw new Error(error);
  }
});

const deletePatient = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const deletePatient = await Patient.findByIdAndDelete(id);
    res.json({ deletePatient });
  } catch (error) {
    throw new Error(error);
  }
});

const softDeletePatient = asyncHandler(async (req, res) => {
  try {
    // Lấy danh sách ID từ body của yêu cầu
    const { ids } = req.body;

    // Kiểm tra xem danh sách ID có tồn tại không
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      throw new Error("Không có ID nào được cung cấp");
    }

    // Tìm kiếm và cập nhật trường deletedAt của tất cả bệnh nhân trong danh sách
    await Patient.updateMany(
      {
        _id: { $in: ids },
      },
      {
        $set: {
          deletedAt: Date.now(),
        },
      }
    );

    // Trả về phản hồi thành công
    res.json({ softdelete: true });
  } catch (error) {
    throw new Error(error);
  }
});

const restorePatient = asyncHandler(async (req, res) => {
  try {
    // Lấy danh sách ID từ body của yêu cầu
    const ids = req.body.ids;

    // Kiểm tra xem danh sách ID có tồn tại không
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      throw new Error("Không có ID nào được cung cấp");
    }

    // Tìm kiếm bệnh nhân dựa trên ID được cung cấp trong yêu cầu.
    const restore = await Patient.find({
      _id: { $in: ids },
    });

    // Đặt trường deletedAt của bệnh nhân thành null.
    for (const restorepatient of restore) {
      restorepatient.deletedAt = null;
      await restorepatient.save(); // Cập nhật bệnh nhân
    }

    // Trả về phản hồi thành công
    res.json({ restore: true });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createPatient,
  getAllPatient,
  getaPatient,
  updatePatient,
  deletePatient,
  softDeletePatient,
  getSoftPatient,
  restorePatient,
};
