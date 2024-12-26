const express = require("express");
const { getTextById, updateTextById } = require("../controllers/textController");
const authenticateToken = require("../utils/authMiddleware");

const router = express.Router();

// Route to get text by ID with token validation
router.get("/", authenticateToken, getTextById);

// Route to update text by ID with token validation
router.put("/", authenticateToken, updateTextById);

router.get("/",(req,res)=>{
  return {"hello":"herllo"}
})

module.exports = router;
