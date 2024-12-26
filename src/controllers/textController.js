const Text = require("../models/TextSchema");

// Get text by ID
const getTextById = async (req, res) => {
  const id = req.user.id;

  try {
    const text = await Text.findOne({ id });
    if (!text) {
      return res.status(404).json({ message: "Text not found" });
    }
    res.status(200).json(text);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving text", error: error.message });
  }
};

// Update text by ID
const updateTextById = async (req, res) => {
  const id = req.user.id;
  const { text } = req.body;

  try {
    const updatedText = await Text.findOneAndUpdate(
      { id },
      { text },
      { new: true, runValidators: true }
    );

    if (!updatedText) {
      return res.status(404).json({ message: "Text not found" });
    }

    res.status(200).json({ message: "Text updated successfully", updatedText });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating text", error: error.message });
  }
};

module.exports = {
  getTextById,
  updateTextById,
};
