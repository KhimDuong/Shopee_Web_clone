import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

// bên trong component
const navigate = useNavigate();

const handleLogin = async () => {
  try {
    const res = await axios.post('http://localhost:8080/api/auth/login', {
    //const res = await axios.post('http://192.168.0.9:8080/api/auth/login', {
    //const res = await axios.post('https://shopee-clone-backend-7ale.onrender.com/api/auth/login', {
      username,
      password,
    });
    const token = res.data.token;
    localStorage.setItem('jwt', token);
    alert('Login thành công!');
    navigate('/products'); // 👉 chuyển hướng qua trang products
  } catch (err) {
    alert('Sai tài khoản hoặc lỗi kết nối.');
  }
};

const handleGoogleLogin = () => {
    // Redirect browser to backend OAuth2 endpoint
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
    // 🔹 change to your deployed backend URL if not running locally
  };

  return (
    <div>
      <h2>Đăng nhập</h2>
      <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
      <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" />
      <button onClick={handleLogin}>Login</button>
       <hr />
      <button onClick={handleGoogleLogin} style={{ backgroundColor: '#db4437', color: 'white' }}>
        Đăng nhập với Google
      </button>
      <p>
        Chưa có tài khoản?{' '}
        <button onClick={() => navigate('/register')}>Đăng ký</button>
      </p>
    </div>
  );
}
