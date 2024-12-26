const mongoose = require("mongoose");


const textSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  text: { type: String },
});

const Text = mongoose.model("Text", textSchema);

module.exports = Text; 
