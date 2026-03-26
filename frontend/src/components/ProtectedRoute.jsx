import { Navigate } from "react-router-dom";
import { getToken } from "../utils/tokenStorage";

export default function ProtectedRoute({ children }) {
  const token = getToken();
  return token ? children : <Navigate to="/" />;
}