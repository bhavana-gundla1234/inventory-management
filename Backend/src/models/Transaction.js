const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: true
    },

    productName: {
      type: String,
      required: true
    },

    quantity: {
      type: Number,
      required: true
    },

    price: {
      type: Number,
      required: true
    },

    amount: {
      type: Number,
      required: true
    },

    type: {
      type: String,
      enum: ["sale", "purchase"],
      required: true
    },

    date: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Transaction", transactionSchema);