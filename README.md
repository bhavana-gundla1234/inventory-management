# 📦 Inventory & Sales Management System

A full-stack web application to manage products, inventory, sales, purchases, invoices, and analytics — built as part of the MERN evaluation.

---

## 🚀 Tech Stack

### 🎨 Frontend

* React JS
* Vanilla CSS / CSS Modules

### ⚙️ Backend

* Node.js
* Express.js

### 🗄️ Database

* MongoDB

---

## ✨ Features

### 🔐 Authentication

* User Signup & Login
* Forgot Password functionality
* Secure password handling

---

### 🏠 Dashboard

* Sales Overview (count, revenue, profit, cost)
* Purchase Overview
* Inventory Summary (stock, low stock)
* Product Summary (products, categories)
* Graphs & insights (Sales vs Purchase, Top Products)

---

### 📦 Product Management

* Add product manually
* Upload products via CSV
* Fields:

  * Product Name, ID, Category
  * Price, Quantity, Unit
  * Expiry Date, Threshold
* Low stock detection
* Stock status (In Stock / Low / Out of Stock)

---

### 🛒 Sales & Purchase Simulation

* Buy products from UI
* Automatically updates:

  * Inventory
  * Dashboard stats
  * Invoice records

---

### 🧾 Invoice Module

* View all invoices
* Mark as Paid / Unpaid
* Delete invoice
* Pagination support

---

### 📊 Statistics

* Revenue tracking
* Products sold
* Inventory insights
* Sales vs Purchase graphs
* Top-selling products

---

### ⚙️ Settings

* Update user profile
* Change password

---

## 📁 Project Structure

```
├── frontend
│   ├── components
│   ├── pages
│   ├── styles
│
├── backend
│   ├── src
│   │   ├── config
│   │   ├── controllers
│   │   ├── routes
│   │   ├── models
│   │   ├── middleware
│   │   ├── cron
│
├── uploads (if using local storage)
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

```bash
git clone <repo-link>
cd Inventory-and-Sales-Management-System
```

---

### 2️⃣ Backend Setup

```bash
cd Backend
npm install
```

Create `.env` file:

```env
PORT=3003
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Run backend:

```bash
npm run dev
```

---

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 📤 File Upload

* Implemented using **multer**
* Supports image upload for products
* Files can be stored:

  * Locally (uploads folder)
  * OR using cloud storage (recommended)

---

## ⏱️ Background Jobs (Cron)

* Automatically checks:

  * Out-of-stock products
* Runs after purchase or scheduled intervals

---

## 📌 API Endpoints

### Auth

* `POST /api/auth/signup`
* `POST /api/auth/login`

### Products

* `GET /api/products`
* `POST /api/products`
* `POST /api/products/upload`

### Invoices

* `GET /api/invoices`
* `PUT /api/invoices/:id`

### Dashboard

* `GET /api/dashboard`

---

## 🎯 Key Highlights

* Clean and responsive UI (matches Figma design)
* Modular backend architecture
* Real-time inventory updates
* Scalable structure
* Proper error handling

---

## 🚨 Constraints Followed

* ✔ Used only allowed tech stack
* ✔ Matched Figma design exactly
* ✔ No external UI libraries used
* ✔ Used Vanilla CSS

---

## 🔮 Future Improvements

* AWS S3 integration for image storage
* Role-based access control
* Advanced analytics
* Notifications system

---

## 👨‍💻 Author

**Bhavana Gundla**

---

