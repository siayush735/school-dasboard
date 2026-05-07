import { createContext, useContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  // ✅ Restore user from localStorage
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");

    return savedUser
      ? JSON.parse(savedUser)
      : null;
  });

  // ✅ Login
  const login = (data) => {
    localStorage.setItem("token", data.token);

    // ✅ Save user also
    localStorage.setItem("user", JSON.stringify(data));

    setUser(data);
  };

  // ✅ Logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);