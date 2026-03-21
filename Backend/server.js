require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./src/config/db");

const authRoutes = require("./src/routes/authRoutes");
const productRoutes = require("./src/routes/productRoutes");
const invoiceRoutes = require("./src/routes/invoiceRoutes");
const dashboardRoutes = require("./src/routes/dashboardRoutes");
const settingsRoutes = require("./src/routes/settingsRoutes");

const stockCron = require("./src/cron/stockCron");

require("./src/cron/stockCron");

const app = express();



connectDB();
stockCron();
app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
  res.send("Inventory and Sales Management System API");
});
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/settings", settingsRoutes);

const PORT = process.env.PORT || 3003;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});