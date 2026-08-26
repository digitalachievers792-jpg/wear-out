import { createContext, useContext, useState } from 'react';

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('wearout_admin_token') || null);
  const [email, setEmail] = useState(() => localStorage.getItem('wearout_admin_email') || null);

  const login = (tok, mail) => {
    localStorage.setItem('wearout_admin_token', tok);
    localStorage.setItem('wearout_admin_email', mail);
    setToken(tok);
    setEmail(mail);
  };

  const logout = () => {
    localStorage.removeItem('wearout_admin_token');
    localStorage.removeItem('wearout_admin_email');
    setToken(null);
    setEmail(null);
  };

  return (
    <AdminAuthContext.Provider value={{ token, email, isAuthenticated: !!token, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export const useAdminAuth = () => useContext(AdminAuthContext);
