const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  amount: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ["income", "expense"],
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  userId: String
});

module.exports = mongoose.model("Transaction", transactionSchema);