const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");

const {
  getDashboardOverview,
  getSalesPurchaseGraph,
  getTopProducts,
  getStatisticsCards
} = require("../controllers/dashboardController");


// Home dashboard overview
router.get("/overview", authMiddleware, getDashboardOverview);


// Sales vs Purchase graph data
router.get("/sales-purchase-graph", authMiddleware, getSalesPurchaseGraph);


// Top selling products
router.get("/top-products", authMiddleware, getTopProducts);


// Statistics cards (revenue, products sold, stock)
router.get("/statistics", authMiddleware, getStatisticsCards);


module.exports = router;