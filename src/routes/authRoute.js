const express = require("express");
const {
  createUser,
  loginUserCtrl,
  getAllUser,
  getaUser,
  deleteUser,
  updateaUser,
  blockeUser,
  unblockUser,
  handleRefreshToken,
  logout,
  updatePassword,
  forgotPasswordToken,
  resetPassword,
} = require("../controller/userCtrl");

const {
  SendCodeAuthentication,
} = require("../controller/two-face-authentication/authenticationCtrl");

const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();
router.post("/register", createUser);
router.post("/forgot-password-token", forgotPasswordToken);
router.put("/reset-password/:token", resetPassword);
router.post("/login", loginUserCtrl);
router.get("/logout", logout);
router.get("/refresh", handleRefreshToken);
router.put("/password", updatePassword);
router.post("/2fa", SendCodeAuthentication);
router.use(authMiddleware);
router.get("/all-users", getAllUser);
router.get("/:id", getaUser);
router.delete("/:id", deleteUser);
router.put("/edit-user", updateaUser);
router.put("/block-user/:id", isAdmin, blockeUser);
router.put("/unblock-user/:id", isAdmin, unblockUser);

module.exports = router;
