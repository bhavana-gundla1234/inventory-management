const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      default: ""
    },

    name: {
      type: String,
      required: true,
      trim: true
    },

    productId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    category: {
      type: String,
      required: true
    },

    price: {
      type: Number,
      required: true,
      min: 0
    },

    quantity: {
      type: Number,
      required: true,
      min: 0
    },

    unit: {
      type: String,
      required: true
    },

    expiryDate: {
      type: Date
    },

    threshold: {
      type: Number,
      required: true,
      default: 5
    },

    status: {
      type: String,
      enum: ["in-stock", "low-stock", "out-of-stock"],
      default: "in-stock"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Product", productSchema);