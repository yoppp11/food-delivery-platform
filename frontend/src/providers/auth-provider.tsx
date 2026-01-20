import { createContext, useContext, type ReactNode } from 'react';
import { useSession, useSignOut } from '@/hooks/use-auth';
import type { User } from '@/types';

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { data: session, isPending: isLoading } = useSession();
  const signOutMutation = useSignOut();

  const user = session?.user ?? null;
  const isAuthenticated = !!user;

  const signOut = () => {
    signOutMutation.mutate();
  };

  const value: AuthContextValue = {
    user,
    isLoading,
    isAuthenticated,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}

export default AuthProvider;
