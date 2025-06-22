import { useEffect, useState } from 'react';
import axios from 'axios';


export default function ProductPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('jwt');

    //axios.get('http://localhost:8080/products', {
    //axios.get('http://192.168.0.9:8080/products', {
    axios.get('https://shopee-clone-backend-7ale.onrender.com/products', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => setProducts(res.data))
    .catch(err => console.error(err)); // automatically move back to login page without needing to code for the automatic navigation
  }, []);

  return (
    <div>
      <h2>Danh sách sản phẩm</h2>
      <ul>
        {products.map(p => (
          <li key={p.id}>{p.name} - {p.price}₫</li>
        ))}
      </ul>
    </div>
  );
}
