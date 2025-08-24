import { Navigate } from "react-router-dom";
import { isAuthed } from "../auth";

export default function PublicRoute({ children }) {
  return isAuthed() ? <Navigate to="/products" replace /> : children;
}