const fs = require("fs");

const parseCSV = (filePath) => {

  const fileContent = fs.readFileSync(filePath, "utf8");
const lines = fileContent.trim().split(/\r?\n/);


  console.log("File Content:", fileContent);
console.log("Lines:", lines);
  if (lines.length < 2) {
    return { validProducts: [], errors: ["CSV file is emptyyyyyyyyyyy"] };
  }

  // const headers = lines[0].split(",").map(h => h.trim());
const headers = lines[0]
  .replace(/^\uFEFF/, "")
  .split(",")
  .map(h => h.trim());


  console.log("Headers:", headers);


  const requiredFields = [
    "name",
    "productId",
    "category",
    "price",
    "quantity",
    "unit",
    "expiryDate",
    "threshold"
  ];

  const validProducts = [];
  const errors = [];

  for (let i = 1; i < lines.length; i++) {

    const values = lines[i].split(",");

    if (values.length !== headers.length) {
      errors.push(`Row ${i + 1}: Column count mismatch`);
      continue;
    }

    const product = {};

    headers.forEach((header, index) => {
      product[header] = values[index]?.trim();
    });

    console.log("Product after mapping:", product);

    // Validate required fields
    let missingFields = [];

    requiredFields.forEach(field => {
      if (!product[field]) {
        missingFields.push(field);
      }
    });

    if (missingFields.length > 0) {
      errors.push(`Row ${i + 1}: Missing fields ${missingFields.join(", ")}`);
      continue;
    }

    // Convert numeric fields
    product.price = Number(product.price);
    product.quantity = Number(product.quantity);
    product.threshold = Number(product.threshold);
    product.expiryDate = new Date(product.expiryDate);
    
    if (isNaN(product.price) || isNaN(product.quantity)) {
      errors.push(`Row ${i + 1}: Invalid number values`);
      continue;
    }

    validProducts.push(product);
  }

  console.log("validProducts:", validProducts);
console.log("errors:", errors);


  return {
    validProducts,
    errors
  };
};

module.exports = parseCSV;