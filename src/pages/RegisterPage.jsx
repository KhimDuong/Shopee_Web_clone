// src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      //await axios.post('http://localhost:8080/api/auth/register', formData);
      //await axios.post('http://192.168.0.9:8080/api/auth/register', formData); 
      await axios.post('https://shopee-clone-backend-7ale.onrender.com/api/auth/register', formData); //https://shopee-clone-backend-7ale.onrender.com
      navigate('/');
    } catch (err) {
      setError('Đăng ký thất bại. Tài khoản có thể đã tồn tại.');
    }
  };

  return (
    <div>
      <h2>Đăng ký</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
        <button type="submit">Đăng ký</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
}

export default RegisterPage;