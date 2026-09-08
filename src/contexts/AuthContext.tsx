import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
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
  isAdmin: boolean;
  loading: boolean;
  signUp: (input: { fullname: string; email: string; password: string }) => Promise<AuthResult & { needsConfirmation?: boolean }>;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
  updateProfile: (patch: Partial<Pick<CurrentUser, 'fullname' | 'phone' | 'address'>> & { email?: string; password?: string }) => Promise<AuthResult>;
  resetPassword: (email: string) => Promise<AuthResult>;
  updatePassword: (password: string) => Promise<AuthResult>;
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
  const [sessionLoading, setSessionLoading] = useState(true);

  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setUser(data.session?.user ?? null);
      setSessionLoading(false);
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

  // Load the user's role (for admin gating). This is a second round-trip after
  // the session resolves, so it has its own loading flag: without it, `isAdmin`
  // reads false while the profile is in flight and an admin briefly gets the
  // "restricted area" screen.
  const [role, setRole] = useState<string | null>(null);
  const [roleLoading, setRoleLoading] = useState(true);
  useEffect(() => {
    if (!user) {
      setRole(null);
      setRoleLoading(false);
      return;
    }
    let active = true;
    setRoleLoading(true);
    supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (!active) return;
        setRole((data?.role as string) ?? 'customer');
        setRoleLoading(false);
      });
    return () => {
      active = false;
    };
  }, [user]);
  const isAdmin = role === 'admin';

  // Consumers must not act on `currentUser` or `isAdmin` until both round-trips
  // are done — gating on a half-loaded auth state is what caused the flash.
  const loading = sessionLoading || roleLoading;

  const signUp: AuthContextType['signUp'] = async ({ fullname, email, password }) => {
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { fullname: fullname.trim(), phone: '', address: '' },
        // Redirect back to wherever the user signed up (prod or local),
        // instead of relying on the Supabase Site URL default.
        emailRedirectTo: window.location.origin,
      },
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

  const resetPassword: AuthContextType['resetPassword'] = async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return error ? { error: error.message } : {};
  };

  const updatePassword: AuthContextType['updatePassword'] = async (password) => {
    const { error } = await supabase.auth.updateUser({ password });
    return error ? { error: error.message } : {};
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
    <AuthContext.Provider value={{ currentUser, isAdmin, loading, signUp, signIn, signOut, updateProfile, resetPassword, updatePassword }}>
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
