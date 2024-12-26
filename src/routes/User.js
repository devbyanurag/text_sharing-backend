const express = require("express");
const router = express.Router();
const {
  createUser,
  getAllUsers,
  updateUser,
  deleteUser,

  loginUser,
  verifyLogin,
  validateToken,
} = require("../controllers/User");

router.post("/create", createUser);
router.post("/login", loginUser);

router.get("/verifyLogin/:token", verifyLogin);

router.get("/users", getAllUsers);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

router.get("/validate", validateToken);

module.exports = router;
