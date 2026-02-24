'use client';

import PropTypes from 'prop-types';
import { useMemo, useCallback } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';

import { AuthContext } from './auth-context';

// ----------------------------------------------------------------------

export function AuthProvider({ children }) {
  const { data: session, status } = useSession();

  const isLoading = status === 'loading';
  const isAuthenticated = status === 'authenticated';

  // LOGIN via NextAuth credentials
  const login = useCallback(async (email, password) => {
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      throw new Error('Invalid email or password');
    }
  }, []);

  // LOGOUT via NextAuth
  const logout = useCallback(async () => {
    await signOut({ redirect: false });
  }, []);

  const memoizedValue = useMemo(
    () => ({
      user: session?.user ?? null,
      method: 'jwt',
      loading: isLoading,
      authenticated: isAuthenticated,
      unauthenticated: !isAuthenticated && !isLoading,
      login,
      logout,
    }),
    [isLoading, isAuthenticated, session, login, logout]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node,
};
