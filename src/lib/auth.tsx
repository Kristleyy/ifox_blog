import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  currentUser: string | null;
  login: (username?: string, password?: string) => boolean;
  register: (username?: string, password?: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_STORAGE_KEY = 'ifoxblog_admin_users';

// Initialize default admin if no users exist
const getStoredUsers = () => {
  const stored = localStorage.getItem(USERS_STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  const defaultUser = { admin: 'admin123' };
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(defaultUser));
  return defaultUser;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('admin_auth') === 'true';
  });
  
  const [currentUser, setCurrentUser] = useState<string | null>(() => {
    return localStorage.getItem('admin_current_user') || 'admin';
  });

  const [users, setUsers] = useState<Record<string, string>>(getStoredUsers);

  useEffect(() => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  }, [users]);

  const login = (username?: string, password?: string) => {
    if (username && password && users[username] === password) {
      setIsAuthenticated(true);
      setCurrentUser(username);
      localStorage.setItem('admin_auth', 'true');
      localStorage.setItem('admin_current_user', username);
      return true;
    }
    return false;
  };

  const register = (username?: string, password?: string) => {
    if (!username || !password) return false;
    
    // Check if user already exists
    if (users[username]) {
      return false;
    }

    setUsers(prev => ({ ...prev, [username]: password }));
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.removeItem('admin_auth');
    localStorage.removeItem('admin_current_user');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, currentUser, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
