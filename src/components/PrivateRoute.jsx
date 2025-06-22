import { Navigate } from 'react-router-dom';

export default function PrivateRoute({ children }) {
  const token = localStorage.getItem('jwt');
  return token ? children : <Navigate to="/" />; //navigate to login
}
