const { v4: uuidv4 } = require("uuid");
const User = require("../models/UserSchema");
const passwordUtils = require("../utils/passwordUtils");

const jwt = require("jsonwebtoken");

const createUser = async (req, res) => {
  try {
    let { name, email, password } = req.body;
    email = email.toLowerCase();

    // Check if user with the email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      if (existingUser.verified) {
        return res
          .status(400)
          .json({ message: "User already exists with this email" });
      } else {
        // Optionally, update the existing user here instead of deleting
        await User.findOneAndDelete({ email });
      }
    }

    let id = uuidv4();
    const newUser = new User({
      id,
      name,
      email,
      password: await passwordUtils.hashPassword(password),
      verified: false,
    });

    // Save the new user
    await newUser.save();

    // Generate a JWT token with user's email for verification link
    const token = jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: "5m",
    });

    // let url = `${process.env.FRONTEND_URL}/signupVerify/${token}`;
    let url = `http://localhost:5001/user/verifyLogin/${token}`;


    // Return the saved user and the token in the response
    res.json({ message: "User Created", token: url });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const loginUser = async (req, res) => {
  try {
    let { email, password } = req.body;
    email = email.toLowerCase();

    // Check if user exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!user.verified) {
      return res.status(404).json({ message: "User not found" });
    }
    if (! await passwordUtils.verifyPassword(password,user.password)) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });

    const userToSend = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      verified: user.verified,
    };

    res.json({ token, user: userToSend });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const verifyLogin = async (req, res) => {
  const token = req.params.token;

  if (!token) {
    return res.status(400).json({ message: "Token not provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id } = decoded;

    // Find the user by id and update verified to true
    const user = await User.findOneAndUpdate({ id }, { verified: true });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const userToSend = {
      id,
      name: user.name,
      email: user.email,
      role: user.role,
      verified: user.verified,
    };

    res.json({ user: userToSend });
  } catch (err) {
    res.status(400).json({ message: "Invalid or expired token" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, imglink, role, verified } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, email, password, imglink, role, verified },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createUser,
  getAllUsers,
  updateUser,
  deleteUser,
  loginUser,

  verifyLogin
};
