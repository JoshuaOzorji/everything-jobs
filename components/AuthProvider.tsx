"use client";

import { SessionProvider } from "next-auth/react";
import { createContext, useContext, ReactNode } from "react";

// Create context for enhanced session data
interface EnhancedSessionContextType {
	initialSession?: any;
	hasCompany?: boolean;
	companyData?: any;
}

const EnhancedSessionContext = createContext<EnhancedSessionContextType>({});

export const useEnhancedSession = () => useContext(EnhancedSessionContext);

interface AuthProviderProps {
	children: ReactNode;
	initialSession?: any;
	hasCompany?: boolean;
	companyData?: any;
}

export default function AuthProvider({
	children,
	initialSession,
	hasCompany,
	companyData,
}: AuthProviderProps) {
	return (
		<SessionProvider session={initialSession}>
			<EnhancedSessionContext.Provider
				value={{
					initialSession,
					hasCompany,
					companyData,
				}}>
				{children}
			</EnhancedSessionContext.Provider>
		</SessionProvider>
	);
}
