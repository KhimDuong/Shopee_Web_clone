import { Navigate, useLocation } from "react-router-dom";
import { isAuthed, setToken } from "../auth";

export default function PrivateRoute({ children }) {
  const location = useLocation();

  // pick up token from query or hash
  let token = null;
  const qs = new URLSearchParams(location.search);
  if (qs.has("token")) token = qs.get("token");
  if (!token && location.hash) {
    const hashParams = new URLSearchParams(location.hash.replace(/^#/, ""));
    token = hashParams.get("token");
  }

  if (token) {
    try { token = decodeURIComponent(token); } catch {}
    setToken(token); // this dispatches 'auth-changed'
    // clean URL
    window.history.replaceState({}, document.title, location.pathname);
  }

  return isAuthed() ? children : <Navigate to="/" replace />;
}