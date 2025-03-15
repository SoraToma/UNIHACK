import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { createClient, User, Session, Provider } from '@supabase/supabase-js';

export const supabase = createClient("https://krhvmfnaafwsuygtrrwu.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtyaHZtZm5hYWZ3c3V5Z3Rycnd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4NDk3NTMsImV4cCI6MjA1NzQyNTc1M30.dN3faTXWPz7PedYxQXtKEtyt-SHKHnVBmqn4qRbVviY");

interface SupabaseContextType {
	user: User | null;
	session: Session | null;
	signInWithProvider: (provider: Provider) => Promise<{provider: Provider, url: string} | null>;
	signOut: () => void;
};

const SupabaseContext = createContext<SupabaseContextType>({
	user: null,
	session: null,
	signInWithProvider: async () => null,
	signOut: () => {}
});

export const useSupabase = () => {
	const context = useContext(SupabaseContext);
	if (!context) {
		throw new Error('useSupabase must be used within a SupabaseProvider');
	}
	return context;
}

export const SupabaseProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState<User | null>(null);
	const [session, setSession] = useState<Session | null>(null);

	useEffect (() => {
		supabase.auth.getSession().then(({ data: { session } }) => {
			setSession(session);
			setUser(session?.user ?? null);
		});

		const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
			setSession(session);
			setUser(session?.user ?? null);
		});

		return () => {
			authListener?.subscription.unsubscribe();
		};
	})

	const signInWithProvider = async (provider: Provider) => {
		try {
			const { data, error } = await supabase.auth.signInWithOAuth({ provider: provider, options: { redirectTo: window.location.origin + "/auth/callback" } });
			if (error) throw error;
			return data ? { provider: data.provider, url: data.url } : null;
		} catch (error) {
			console.error('Error signing in with provider:', error);
			return null;
		}
	}

	const signOut = async () => {
		try {
			const { error } = await supabase.auth.signOut();
			if (error) throw error;
			window.location.reload();
		} catch (error) {
			console.error('Error signing out:', error);
		}
	}

	return (
		<SupabaseContext.Provider value={{ user, session, signInWithProvider, signOut }}>
			{children}
		</SupabaseContext.Provider>
	)

};
