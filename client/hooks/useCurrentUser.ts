import { useState, useEffect } from 'react';

export interface CurrentUser {
  id: string;
  username: string;
  email?: string;
}

export const useCurrentUser = () => {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Récupérer l'utilisateur depuis localStorage
    const storedUser = localStorage.getItem('current_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      // Créer un utilisateur anonyme par défaut
      const anonymousUser: CurrentUser = {
        id: 'anonymous',
        username: localStorage.getItem('default_username') || 'Anonyme',
      };
      setUser(anonymousUser);
      localStorage.setItem('current_user', JSON.stringify(anonymousUser));
    }
    setLoading(false);
  }, []);

  const updateUser = (newUser: CurrentUser) => {
    setUser(newUser);
    localStorage.setItem('current_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('current_user');
  };

  return { user, loading, updateUser, logout };
};
