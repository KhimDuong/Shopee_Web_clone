import { Navigate } from "react-router-dom";
import { isAuthed } from "../auth";

export default function PrivateRoute({ children }) {
  return isAuthed() ? children : <Navigate to="/" replace />;
}