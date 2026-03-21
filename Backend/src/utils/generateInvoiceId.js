const generateInvoiceId = () => {
  const timestamp = Date.now();

  const random = Math.floor(Math.random() * 1000);

  return `INV-${timestamp}${random}`;
};

module.exports = generateInvoiceId;