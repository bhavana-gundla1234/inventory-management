const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema(
  {
    invoiceId: {
      type: String,
      required: true,
      unique: true
    },

    referenceNumber: {
      type: String,
      required: true
    },

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

    status: {
      type: String,
      enum: ["paid", "unpaid"],
      default: "unpaid"
    },

    dueDate: {
      type: Date,
      required: true
    },

    customerName: {
      type: String,
      default: "Walk-in Customer"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Invoice", invoiceSchema);