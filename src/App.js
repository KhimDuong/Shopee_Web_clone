import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import PrivateRoute from './components/PrivateRoute';
import ProductPage from './pages/ProductPage';
import RegisterPage from './pages/RegisterPage';



function App() {
  return (
    <BrowserRouter>
          <Routes>
            <Route path="/" element={<LoginPage />} />

            <Route path="/register" element={<RegisterPage />} />
            
            <Route
            path="/products"
            element={
              <PrivateRoute>
                <ProductPage />
              </PrivateRoute>
            }
/>
          </Routes>
        </BrowserRouter>



  );
}

export default App;
