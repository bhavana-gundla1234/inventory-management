const cron = require("node-cron");
const Product = require("../models/Product");

const stockCron = () => {

  // Runs every 30 minutes
  cron.schedule("*/30 * * * *", async () => {
    try {

      console.log("Running stock status check...");

      const products = await Product.find();

      for (let product of products) {

        let newStatus = "in-stock";

        if (product.quantity === 0) {
          newStatus = "out-of-stock";
        } 
        else if (product.quantity <= product.threshold) {
          newStatus = "low-stock";
        }

        if (product.status !== newStatus) {
          product.status = newStatus;
          await product.save();
        }
      }

      console.log("Stock status updated successfully");

    } catch (error) {
      console.error("Stock cron error:", error);
    }
  });

};

module.exports = stockCron;