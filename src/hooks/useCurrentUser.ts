import { useState, useEffect } from 'react';
import { authClient } from '@/lib/auth-client';

export interface CurrentUser {
  id: string;
  username: string;
  email?: string;
}

export const useCurrentUser = () => {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Use authClient instead of manual fetch
        const { data: session } = await authClient.getSession();

        if (session && session.user) {
          const authenticatedUser: CurrentUser = {
            id: session.user.id,
            username: session.user.name || session.user.email?.split('@')[0] || 'User',
            email: session.user.email,
          };
          setUser(authenticatedUser);
          setIsAuthenticated(true);
          localStorage.setItem('current_user', JSON.stringify(authenticatedUser));
          setLoading(false);
          return;
        }
      } catch (error) {
        console.warn('Auth check failed, using anonymous mode:', error);
      }

      // Fallback to anonymous user for public pages
      const storedUser = localStorage.getItem('current_user');
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          setUser(parsed);
          setIsAuthenticated(parsed.id !== 'anonymous');
        } catch {
          // Invalid stored user
        }
      } else {
        // Create anonymous user for public access
        const anonymousUser: CurrentUser = {
          id: 'anonymous',
          username: localStorage.getItem('default_username') || 'Anonyme',
        };
        setUser(anonymousUser);
        setIsAuthenticated(false);
        localStorage.setItem('current_user', JSON.stringify(anonymousUser));
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const updateUser = (newUser: CurrentUser) => {
    setUser(newUser);
    setIsAuthenticated(newUser.id !== 'anonymous');
    localStorage.setItem('current_user', JSON.stringify(newUser));
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    }

    // Create new anonymous user
    const anonymousUser: CurrentUser = {
      id: 'anonymous',
      username: 'Anonyme',
    };
    setUser(anonymousUser);
    setIsAuthenticated(false);
    localStorage.setItem('current_user', JSON.stringify(anonymousUser));
  };

  return { user, loading, isAuthenticated, updateUser, logout };
};
