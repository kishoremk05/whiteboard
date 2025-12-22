import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';
import type { UserProfile } from '../types/database.types';

// Extended user type combining Supabase auth and user profile
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
  subscription: 'free' | 'pro' | 'team';
  isAdmin: boolean;
  isSuspended: boolean;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    updates: boolean;
  };
  defaultView: 'grid' | 'list';
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Default user preferences
const defaultPreferences: UserPreferences = {
  theme: 'system',
  language: 'en',
  notifications: {
    email: true,
    push: true,
    updates: false,
  },
  defaultView: 'grid',
};

/**
 * Safely parse metadata as UserPreferences
 */
function parsePreferences(metadata: Record<string, unknown> | null | undefined): UserPreferences {
  if (!metadata) return defaultPreferences;
  
  // Try to extract known preference fields, fallback to defaults
  return {
    theme: (metadata.theme as UserPreferences['theme']) ?? defaultPreferences.theme,
    language: (metadata.language as string) ?? defaultPreferences.language,
    notifications: {
      email: (metadata.notifications as { email?: boolean })?.email ?? defaultPreferences.notifications.email,
      push: (metadata.notifications as { push?: boolean })?.push ?? defaultPreferences.notifications.push,
      updates: (metadata.notifications as { updates?: boolean })?.updates ?? defaultPreferences.notifications.updates,
    },
    defaultView: (metadata.defaultView as UserPreferences['defaultView']) ?? defaultPreferences.defaultView,
  };
}

/**
 * Transform Supabase auth user + profile into app User type
 */
function transformUser(authUser: SupabaseUser, profile: UserProfile | null): User {
  return {
    id: authUser.id,
    email: authUser.email || '',
    name: profile?.name || authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'User',
    avatar: authUser.user_metadata?.avatar_url,
    bio: undefined,
    createdAt: profile?.created_at || authUser.created_at,
    updatedAt: profile?.updated_at || new Date().toISOString(),
    subscription: 'free', // Would come from subscriptions table
    isAdmin: profile?.is_admin || false,
    isSuspended: profile?.is_suspended || false,
    preferences: parsePreferences(profile?.metadata),
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Fetch user profile from user_profiles table
   */
  const fetchUserProfile = useCallback(async (userId: string): Promise<UserProfile | null> => {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.warn('Could not fetch user profile:', error.message);
      return null;
    }
    return data;
  }, []);

  /**
   * Create or update user profile in user_profiles table
   */
  const upsertUserProfile = useCallback(async (
    userId: string,
    email: string,
    name?: string,
    metadata?: Record<string, unknown>
  ): Promise<UserProfile | null> => {
    const { data, error } = await supabase
      .from('user_profiles')
      .upsert({
        id: userId,
        email,
        name: name || email.split('@')[0],
        metadata: metadata || defaultPreferences,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'id',
      })
      .select()
      .single();

    if (error) {
      console.error('Could not upsert user profile:', error.message);
      return null;
    }
    return data;
  }, []);

  /**
   * Track login activity
   */
  const trackLoginActivity = useCallback(async (userId: string) => {
    try {
      await supabase.from('login_activity').insert({
        user_id: userId,
        ip_address: null, // Would need server-side for real IP
        user_agent: navigator.userAgent,
        device_fingerprint: null,
        trusted_device: false,
        login_at: new Date().toISOString(),
      });

      // Update last_login_at in user_profiles
      await supabase
        .from('user_profiles')
        .update({ last_login_at: new Date().toISOString() })
        .eq('id', userId);
    } catch (error) {
      console.warn('Could not track login activity:', error);
    }
  }, []);

  /**
   * Load user on mount and listen for auth changes
   */
  useEffect(() => {
    let mounted = true;
    let initialLoadComplete = false;
    
    console.log('[Auth] Setting up auth listener...');
    
    // Fallback timeout - if nothing happens in 1.5s, stop loading
    const fallbackTimeout = setTimeout(() => {
      if (mounted && !initialLoadComplete) {
        console.log('[Auth] Fallback: stopping loading after 1.5s');
        setIsLoading(false);
        initialLoadComplete = true;
      }
    }, 1500);

    // Listen for auth changes - this handles everything including initial session
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log('[Auth] Auth state change:', event, newSession ? 'session exists' : 'no session');
      
      // Clear fallback timeout on any event
      if (!initialLoadComplete) {
        clearTimeout(fallbackTimeout);
        initialLoadComplete = true;
      }
      
      setSession(newSession);
      
      if (event === 'INITIAL_SESSION') {
        // Initial load - set user and stop loading immediately
        if (newSession?.user) {
          setUser(transformUser(newSession.user, null));
          // Fetch profile in background
          fetchUserProfile(newSession.user.id)
            .then(profile => {
              if (mounted && profile) {
                setUser(transformUser(newSession.user, profile));
              }
            })
            .catch(err => console.warn('[Auth] Background profile fetch failed:', err));
        }
        if (mounted) setIsLoading(false);
      } else if (event === 'SIGNED_IN' && newSession?.user) {
        setUser(transformUser(newSession.user, null));
        if (mounted) setIsLoading(false);
        // Fetch profile in background
        fetchUserProfile(newSession.user.id)
          .then(profile => {
            if (mounted && profile) {
              setUser(transformUser(newSession.user, profile));
            }
          })
          .catch(err => console.warn('[Auth] Profile fetch on sign in failed:', err));
        trackLoginActivity(newSession.user.id).catch(console.warn);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        if (mounted) setIsLoading(false);
      } else if (event === 'USER_UPDATED' && newSession?.user) {
        fetchUserProfile(newSession.user.id)
          .then(profile => {
            if (mounted) setUser(transformUser(newSession.user, profile));
          })
          .catch(err => console.warn('[Auth] Profile fetch on update failed:', err));
      }
    });

    return () => {
      mounted = false;
      clearTimeout(fallbackTimeout);
      subscription.unsubscribe();
    };
  }, [fetchUserProfile, trackLoginActivity]);

  /**
   * Login with email and password
   */
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Sign up with email, password, and name
   */
  const signup = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
        },
      });

      if (error) throw error;

      // Create user profile
      if (data.user) {
        await upsertUserProfile(data.user.id, email, name);
      }
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Logout
   */
  const logout = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Request password reset email
   */
  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw error;
  };

  /**
   * Update user profile
   */
  const updateUser = async (updates: Partial<User>) => {
    if (!user || !session) throw new Error('Not authenticated');

    // Update user_profiles table
    const profileUpdates: Partial<UserProfile> = {};
    if (updates.name !== undefined) profileUpdates.name = updates.name;
    if (updates.preferences !== undefined) profileUpdates.metadata = updates.preferences as unknown as Record<string, unknown>;

    if (Object.keys(profileUpdates).length > 0) {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          ...profileUpdates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;
    }

    // Update local state
    setUser(prev => prev ? { ...prev, ...updates, updatedAt: new Date().toISOString() } : null);
  };

  /**
   * Refresh user data from database
   */
  const refreshUser = async () => {
    if (!session?.user) return;
    
    const profile = await fetchUserProfile(session.user.id);
    setUser(transformUser(session.user, profile));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        isAuthenticated: !!user && !!session,
        login,
        signup,
        logout,
        resetPassword,
        updateUser,
        refreshUser,
      }}
    >
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
