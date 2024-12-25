const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  createdAt: { type: String, default: Date.now },
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["USER", "HOST", "ADMIN"],
    default: "USER",
  },
  verified: { type: Boolean, required: true },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
