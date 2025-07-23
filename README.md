# Shopee Clone - Frontend

This is the frontend of a simplified e-commerce web app inspired by Shopee. It enables users to browse products, register/log in, and place orders, with role-specific dashboards for buyers, sellers, and admins.

---

## 🚀 Features

* User Authentication (JWT-based)
* Responsive UI using React
* Role-based interfaces:

  * Buyer: browse, view products, purchase
  * Seller: add/edit/delete products
  * Admin: manage users, products, orders
* Product image upload and preview
* Shopping cart & checkout
* Order history tracking

---

## 🛠 Tech Stack

* React.js
* Redux Toolkit (for global state)
* React Router DOM
* Axios
* Tailwind CSS

---

## 📁 Folder Structure

```
frontend/
├── src/
│   ├── assets/
│   ├── components/
│   ├── pages/
│   ├── redux/
│   ├── App.js
│   ├── index.js
├── .env
├── package.json
```

---

## 📦 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/shopee-clone-frontend.git
cd shopee-clone-frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 4. Start the development server

```bash
npm start
```

---

## 🔐 Authentication Flow

* Login credentials are validated via the backend
* JWT is stored in localStorage
* Protected routes redirect unauthorized users to login



## ✅ Improvements Planned

* MoMo payment gateway
* Better UI polish with loading skeletons
* Real-time order updates



Built with ❤️ using React & Redux.
