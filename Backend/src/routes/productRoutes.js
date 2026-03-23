const express = require("express");
const router = express.Router();
 
 
const multer = require("multer");
const path = require("path");
const fs = require("fs");
 
// Ensure uploads/products directory exists
const uploadDir = "uploads/products";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
 
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
 
const upload = multer({ storage: storage });
const uploadCSV = multer({ dest: "uploads/" });
 
const authMiddleware = require("../middlewares/authMiddleware");
 
const {
  addProduct,
  uploadCSVProducts,
  getProducts,
  searchProducts,
  buyProduct,
  updateProduct,
  deleteProduct,
  getInventorySummary,
  getTopSellingProducts
} = require("../controllers/productController");
 
 
// Add product manually
router.post("/add", authMiddleware, upload.single("image"), addProduct);
 
 
// Upload CSV for bulk products
router.post("/upload-csv", authMiddleware, uploadCSV.single("file"), uploadCSVProducts);
 
// Get Inventory Summary
router.get("/inventory-summary", authMiddleware, getInventorySummary);
 
// Get Top Selling (Special exactly 6)
router.get("/top-selling", authMiddleware, getTopSellingProducts);
 
 
// Get all products (pagination)
router.get("/", authMiddleware, getProducts);
 
 
// Search product by name or productId
router.get("/search", authMiddleware, searchProducts);
 
 
// Buy simulation
router.post("/buy/:id", authMiddleware, buyProduct);
 
 
// Update product
router.put("/:id", authMiddleware, updateProduct);
 
 
// Delete product
router.delete("/:id", authMiddleware, deleteProduct);
 
 
module.exports = router;
 