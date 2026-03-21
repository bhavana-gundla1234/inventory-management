const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");

const {
  getInvoiceDashboard,
  getInvoices,
  getInvoiceById,
  markInvoicePaid,
  markInvoiceUnpaid,
  deleteInvoice
} = require("../controllers/invoiceController");


// Invoice dashboard summary cards
router.get("/dashboard", authMiddleware, getInvoiceDashboard);


// Get all invoices (pagination)
router.get("/", authMiddleware, getInvoices);


// View single invoice
router.get("/:id", authMiddleware, getInvoiceById);


// Mark invoice as paid
router.put("/paid/:id", authMiddleware, markInvoicePaid);


// Mark invoice as unpaid
router.put("/unpaid/:id", authMiddleware, markInvoiceUnpaid);


// Delete invoice
router.delete("/:id", authMiddleware, deleteInvoice);


module.exports = router;