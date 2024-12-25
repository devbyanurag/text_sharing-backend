const bcrypt = require("bcrypt");

// Function to hash a password
const hashPassword = async (password) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds
    return hashedPassword;
  } catch (error) {
    throw new Error("Error hashing password");
  }
};

// Function to verify a password against a hashed password
const verifyPassword = async (password, hashedPassword) => {
  try {
    const match = await bcrypt.compare(password, hashedPassword);
    return match;
  } catch (error) {
    throw new Error("Error verifying password");
  }
};

module.exports = {
  hashPassword,
  verifyPassword,
};
