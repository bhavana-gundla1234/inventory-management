const Product = require("../models/Product");
const Transaction = require("../models/Transaction");
const Invoice = require("../models/Invoice");

const parseCSV = require("../utils/csvParser");
const generateInvoiceId = require("../utils/generateInvoiceId");


// Add product manually
exports.addProduct = async (req, res) => {
  try {

    const product = await Product.create(req.body);
    // const amount = product.quantity * product.price;
    //adding in the transaction collection as purchase
    await Transaction.create({
      productId: product.productId,
      productName: product.name,
      quantity: product.quantity,
      price: product.price,
      amount: product.quantity * product.price,
      type: "purchase"
    });
    res.json({
      success: true,
      product
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Failed to add product"
    });

  }
};



// Upload CSV products
exports.uploadCSVProducts = async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "CSV file required"
      });
    }

    const { validProducts, errors } = parseCSV(req.file.path);

    console.log("Valid Products:", validProducts);

    let insertedProducts = [];

    for (let product of validProducts) {


      const newProduct = await Product.create({
        ...product,
        status: "in-stock"
      });

      await Transaction.create({
        productId: newProduct.productId,
        productName: newProduct.name,
        quantity: newProduct.quantity,
        price: newProduct.price,
        amount: newProduct.quantity * newProduct.price,
        type: "purchase"
      });



      insertedProducts.push(newProduct);
    }

    res.json({
      success: true,
      insertedProducts,
      errors
    });

  } catch (error) {
    console.error("CSV Upload Error:", error);
    res.status(500).json({
      success: false,
      message: "CSV upload failed"
    });

  }
};



// Get products with pagination
exports.getProducts = async (req, res) => {
  try {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const products = await Product.find()
      .sort({ createdAt: -1 }) 
      .skip(skip)
      .limit(limit);

    const totalProducts = await Product.countDocuments();

    res.json({
      success: true,
      page,
      totalPages: Math.ceil(totalProducts / limit),
      products
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Failed to fetch products"
    });

  }
};



// Search products
exports.searchProducts = async (req, res) => {
  try {

    const query = req.query.q;

    const products = await Product.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { productId: { $regex: query, $options: "i" } }
      ]
    });

    res.json({
      success: true,
      products
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Search failed"
    });

  }
};



// Buy simulation
exports.buyProduct = async (req, res) => {
  try {

    const { quantity } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    if (product.quantity < quantity) {
      return res.status(400).json({
        success: false,
        message: "Insufficient stock"
      });
    }

    product.quantity -= quantity;

    if (product.quantity === 0) {
      product.status = "out-of-stock";
    }
    else if (product.quantity <= product.threshold) {
      product.status = "low-stock";
    }
    else {
      product.status = "in-stock";
    }

    await product.save();


    const amount = quantity * product.price;


    // Create transaction
    await Transaction.create({
      productId: product.productId,
      productName: product.name,
      quantity,
      price: product.price,
      amount,
      type: "sale"
    });


    // Generate invoice
    const invoice = await Invoice.create({
      invoiceId: generateInvoiceId(),
      referenceNumber: "REF-" + Date.now(),
      productId: product.productId,
      productName: product.name,
      quantity,
      price: product.price,
      amount,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });


    res.json({
      success: true,
      message: "Product purchased successfully",
      product,
      invoice
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Purchase failed"
    });

  }
};



// Update product
exports.updateProduct = async (req, res) => {
  try {

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      success: true,
      product
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Failed to update product"
    });

  }
};



// Delete product
exports.deleteProduct = async (req, res) => {
  try {

    await Product.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Product deleted successfully"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Failed to delete product"
    });

  }
};

// Get Inventory Summary
exports.getInventorySummary = async (req, res) => {
  try {
    const categoriesCount = (await Product.distinct("category")).length;

    const productStats = await Product.aggregate([
      {
        $group: {
          _id: null,
          totalCount: { $sum: 1 },
          totalQuantity: { $sum: "$quantity" },
          totalValue: { $sum: { $multiply: ["$quantity", "$price"] } }
        }
      }
    ]);

    const lowStockCount = await Product.countDocuments({ status: "low-stock" });
    const outOfStockCount = await Product.countDocuments({ status: "out-of-stock" });

    res.json({
      success: true,
      data: {
        categoriesCount,
        totalProducts: productStats[0]?.totalCount || 0,
        totalQuantity: productStats[0]?.totalQuantity || 0,
        totalValue: productStats[0]?.totalValue || 0,
        lowStockCount,
        outOfStockCount
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch summary" });
  }
};

// Get Top Selling (Special logic: exactly 6 items, out-of-stock then low-stock)
exports.getTopSellingProducts = async (req, res) => {
  try {
    let products = await Product.find({ status: "out-of-stock" }).limit(6);

    if (products.length < 6) {
      const remaining = 6 - products.length;
      const lowStock = await Product.find({ status: "low-stock" }).limit(remaining);
      products = [...products, ...lowStock];
    }

    // Amount refers to number of quantity * their cost (price)
    const totalValue = products.reduce((acc, p) => acc + (p.quantity * p.price), 0);

    res.json({
      success: true,
      count: products.length,
      totalValue
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch top selling" });
  }
};