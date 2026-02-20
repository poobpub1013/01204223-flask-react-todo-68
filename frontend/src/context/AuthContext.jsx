import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("accessToken")
  );
  const [username, setUsername] = useState(
    localStorage.getItem("username")
  );

  function login(username, token) {
    setUsername(username);
    setAccessToken(token);
    localStorage.setItem("username", username);
    localStorage.setItem("accessToken", token);
  }

  function logout() {
    setUsername(null);
    setAccessToken(null);
    localStorage.removeItem("username");
    localStorage.removeItem("accessToken");
  }

  return (
    <AuthContext.Provider
      value={{ username, accessToken, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}