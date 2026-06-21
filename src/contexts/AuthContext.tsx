import React, { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '@/src/lib/supabase';
import { useLanguage } from '@/src/contexts/LanguageContext';

export interface CurrentUser {
  fullname: string;
  email: string;
  joinDate: string;
  phone: string;
  address: string;
}

type AuthResult = { error?: string };

interface AuthContextType {
  currentUser: CurrentUser | null;
  loading: boolean;
  signUp: (input: { fullname: string; email: string; password: string }) => Promise<AuthResult & { needsConfirmation?: boolean }>;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
  updateProfile: (patch: Partial<Pick<CurrentUser, 'fullname' | 'phone' | 'address'>> & { email?: string; password?: string }) => Promise<AuthResult>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function mapUser(user: User | null, language: string): CurrentUser | null {
  if (!user) return null;
  const md = (user.user_metadata ?? {}) as Record<string, string>;
  return {
    fullname: md.fullname || (user.email ? user.email.split('@')[0] : ''),
    email: user.email ?? '',
    joinDate: user.created_at
      ? new Date(user.created_at).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', {
          year: 'numeric',
          month: 'long',
        })
      : '',
    phone: md.phone ?? '',
    address: md.address ?? '',
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const { language } = useLanguage();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const currentUser = useMemo(() => mapUser(user, language), [user, language]);

  const signUp: AuthContextType['signUp'] = async ({ fullname, email, password }) => {
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { data: { fullname: fullname.trim(), phone: '', address: '' } },
    });
    if (error) return { error: error.message };
    // When email confirmation is enabled, no session is returned until confirmed.
    return { needsConfirmation: !data.session };
  };

  const signIn: AuthContextType['signIn'] = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error) return { error: error.message };
    return {};
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const updateProfile: AuthContextType['updateProfile'] = async (patch) => {
    const updates: { email?: string; password?: string; data?: Record<string, string> } = {};
    if (patch.email) updates.email = patch.email.trim();
    if (patch.password) updates.password = patch.password;

    const data: Record<string, string> = {};
    (['fullname', 'phone', 'address'] as const).forEach((k) => {
      if (patch[k] !== undefined) data[k] = patch[k] as string;
    });
    if (Object.keys(data).length) updates.data = data;

    const { error } = await supabase.auth.updateUser(updates);
    if (error) return { error: error.message };
    return {};
  };

  return (
    <AuthContext.Provider value={{ currentUser, loading, signUp, signIn, signOut, updateProfile }}>
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
