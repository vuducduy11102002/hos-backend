const asyncHandler = require("express-async-handler");
const User = require("../../models/userModel");

const { generateToken } = require("../../config/jwtToken");

const { generateRefreshToken } = require("../../config/refreshtoken");
const speakeasy = require("speakeasy");

const SendCodeAuthentication = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  // Bước 3: Kiểm tra xác minh mã OTP
  const findUser = await User.findOne({ email });
  const verificationCode = findUser.verificationCode;
  const verificationCodeExpires = findUser.verificationCodeExpires;

  if (!verificationCode || !verificationCodeExpires) {
    throw new Error("Mã xác minh OTP không tồn tại");
  }

  // Bước 4: Kiểm tra thời hạn của mã xác minh
  if (Date.now() > verificationCodeExpires) {
    throw new Error("Mã xác minh OTP đã hết hạn");
  }

  // Bước 5: Kiểm tra xác minh mã OTP
  if (otp === verificationCode) {
    // Bước 6: Mã OTP hợp lệ, thực hiện đăng nhập và cấp token
    const refreshToken = await generateRefreshToken(findUser._id);
    const updatedUser = await User.findByIdAndUpdate(
      findUser._id,
      {
        refreshToken,
      },
      { new: true }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      token: generateToken(updatedUser._id),
    });
  } else {
    throw new Error("Mã xác minh OTP không hợp lệ");
  }
});

const qrLoginCtrl = asyncHandler(async (req, res) => {
  const { email, qrCode } = req.body;

  // Bước 1: Lấy secret key từ cơ sở dữ liệu
  const findUser = await User.findOne({ email });
  if (!findUser || !findUser.qrSecret) {
    throw new Error("Invalid email or QR code");
  }

  const secret = findUser.qrSecret;

  // Bước 2: Xác thực mã QR
  const verified = speakeasy.totp.verify({
    secret,
    encoding: "base32",
    token: qrCode,
  });
  console.log("Secret:", secret);
  console.log("QR Code:", qrCode);

  if (verified) {
    // Bước 3: Mã QR hợp lệ, thực hiện đăng nhập và cấp token
    const refreshToken = await generateRefreshToken(findUser._id);
    const updatedUser = await User.findByIdAndUpdate(
      findUser._id,
      {
        refreshToken,
      },
      { new: true }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      token: generateToken(updatedUser._id),
    });
  } else {
    throw new Error("Invalid QR code");
  }
});

module.exports = {
  SendCodeAuthentication,
  qrLoginCtrl,
};
