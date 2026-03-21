const Invoice = require("../models/Invoice");


// Invoice Dashboard Summary
exports.getInvoiceDashboard = async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Card 1: Recent Transactions
    const recentTransactions = await Invoice.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });

    // Card 2: Total Invoices
    const totalInvoicesCount = await Invoice.countDocuments();
    const processedInvoices = await Invoice.countDocuments({ status: "paid" });

    // Card 3: Paid Amount (Last 7 days)
    const recentPaidInvoices = await Invoice.find({
      status: "paid",
      updatedAt: { $gte: sevenDaysAgo }
    });
    const paidAmount = recentPaidInvoices.reduce((sum, inv) => sum + inv.amount, 0);
    const uniquePaidCustomers = [...new Set(recentPaidInvoices.map(inv => inv.customerName))];

    // Card 4: Unpaid Amount (Total Pending)
    const unpaidInvoices = await Invoice.find({ status: "unpaid" });
    const unpaidAmount = unpaidInvoices.reduce((sum, inv) => sum + inv.amount, 0);
    const uniqueUnpaidCustomers = [...new Set(unpaidInvoices.map(inv => inv.customerName))];

    res.json({
      success: true,
      data: {
        recentTransactions,
        totalInvoices: totalInvoicesCount,
        processedInvoices,
        paidAmount,
        paidCustomers: uniquePaidCustomers.length,
        unpaidAmount,
        unpaidCustomers: uniqueUnpaidCustomers.length
      }
    });

  } catch (error) {
    console.error("Invoice Dashboard Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load invoice dashboard"
    });
  }
};




// Get invoices with pagination
exports.getInvoices = async (req, res) => {
  try {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const invoices = await Invoice.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalInvoices = await Invoice.countDocuments();

    res.json({
      success: true,
      page,
      totalPages: Math.ceil(totalInvoices / limit),
      invoices
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Failed to fetch invoices"
    });

  }
};




// Get single invoice
exports.getInvoiceById = async (req, res) => {
  try {

    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found"
      });
    }

    res.json({
      success: true,
      invoice
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Failed to fetch invoice"
    });

  }
};




// Mark invoice as paid
exports.markInvoicePaid = async (req, res) => {
  try {

    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found"
      });
    }

    invoice.status = "paid";

    await invoice.save();

    res.json({
      success: true,
      message: "Invoice marked as paid",
      invoice
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Failed to update invoice"
    });

  }
};




// Mark invoice as unpaid
exports.markInvoiceUnpaid = async (req, res) => {
  try {

    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found"
      });
    }

    invoice.status = "unpaid";

    await invoice.save();

    res.json({
      success: true,
      message: "Invoice marked as unpaid",
      invoice
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Failed to update invoice"
    });

  }
};




// Delete invoice
exports.deleteInvoice = async (req, res) => {
  try {

    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found"
      });
    }

    await invoice.deleteOne();

    res.json({
      success: true,
      message: "Invoice deleted successfully"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Failed to delete invoice"
    });

  }
};