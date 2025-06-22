# Shopee Clone Frontend

Frontend UI for Shopee Clone built with React.

## ⚙️ Tech Stack
- ReactJS
- React Router
- Axios
- JWT Auth (via localStorage)

## 🔐 Features
- Login & Register flow
- Protected routes with PrivateRoute
- Product listing (from backend API)
- JWT-based token handling

## 🚀 Deploy
- Deployed on Vercel: [https://shopee-web-clone-wine.vercel.app](https://shopee-web-clone-wine.vercel.app)
- Connects to backend hosted on Render

## 💻 Local Development
```bash
npm install
npm start
```

Change API base URL if needed:
```js
axios.get("https://your-backend.onrender.com/products")
```