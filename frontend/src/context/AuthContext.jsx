import { createContext, useState } from "react";
import { getToken, setToken, removeToken } from "../utils/tokenStorage";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setAuthToken] = useState(getToken());

  const login = (token) => {
    setToken(token);
    setAuthToken(token);
  };

  const logout = () => {
    removeToken();
    setAuthToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};