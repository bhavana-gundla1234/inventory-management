const Product = require("../models/Product");
const Transaction = require("../models/Transaction");


// Dashboard Overview
exports.getDashboardOverview = async (req, res) => {
  try {

    const sales = await Transaction.find({ type: "sale" });
    const purchases = await Transaction.find({ type: "purchase" });

    const totalSalesValue = sales.reduce((sum, t) => sum + t.amount, 0);
    const totalPurchaseValue = purchases.reduce((sum, t) => sum + t.amount, 0);

    const salesCount = sales.length;
    const purchaseCount = purchases.length;

    const totalProducts = await Product.countDocuments();

    const lowStockCount = await Product.countDocuments({
      status: "low-stock"
    });

    const products = await Product.find();

    const totalItemsInStock = products.reduce(
      (sum, p) => sum + p.quantity,
      0
    );

    const categories = new Set(products.map(p => p.category));

    res.json({
      success: true,
      data: {
        totalSalesValue,
        salesCount,
        totalPurchaseValue,
        purchaseCount,
        totalItemsInStock,
        lowStockCount,
        totalProducts,
        categoriesCount: categories.size
      }
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Failed to load dashboard overview"
    });

  }
};



// Sales vs Purchase Graph
exports.getSalesPurchaseGraph = async (req, res) => {
  try {
    const { range } = req.query; // weekly or monthly

    let groupFormat;
    if (range === "weekly") {
      groupFormat = { $week: "$createdAt" };
    } else {
      groupFormat = { $month: "$createdAt" };
    }

    const sales = await Transaction.aggregate([
      { $match: { type: "sale" } },
      {
        $group: {
          _id: groupFormat,
          total: { $sum: "$amount" }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    const purchases = await Transaction.aggregate([
      { $match: { type: "purchase" } },
      {
        $group: {
          _id: groupFormat,
          total: { $sum: "$amount" }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    res.json({
      success: true,
      sales,
      purchases
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Failed to fetch graph data"
    });

  }
};



// Top selling products
exports.getTopProducts = async (req, res) => {
  try {

    const topProducts = await Transaction.aggregate([
      { $match: { type: "sale" } },
      {
        $group: {
          _id: "$productName",
          totalSold: { $sum: "$quantity" }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 6 }
    ]);

    res.json({
      success: true,
      topProducts
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Failed to fetch top products"
    });

  }
};



// Statistics Cards
exports.getStatisticsCards = async (req, res) => {
  try {

    const sales = await Transaction.find({ type: "sale" });

    const totalRevenue = sales.reduce((sum, s) => sum + s.amount, 0);

    const productsSold = sales.reduce((sum, s) => sum + s.quantity, 0);

    const products = await Product.find();

    const productsInStock = products.reduce(
      (sum, p) => sum + p.quantity,
      0
    );

    res.json({
      success: true,
      data: {
        totalRevenue,
        productsSold,
        productsInStock
      }
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Failed to fetch statistics"
    });

  }
};