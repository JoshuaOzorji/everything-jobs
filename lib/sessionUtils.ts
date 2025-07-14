import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/config";
import { getUserCompanyData } from "@/lib/companyProfileUtils";

export interface EnhancedSession {
	user: {
		id: string;
		email: string;
		name: string;
		role: string;
		companyId?: string;
		hasCompany: boolean;
		companyData?: any;
	};
}

// Cache for session data to avoid repeated DB calls
const sessionCache = new Map<
	string,
	{ data: EnhancedSession; timestamp: number }
>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function getEnhancedSession(): Promise<EnhancedSession | null> {
	try {
		const session = await getServerSession(authOptions);

		if (!session?.user?.email) {
			return null;
		}

		// Check cache first
		const cacheKey = session.user.email;
		const cached = sessionCache.get(cacheKey);

		if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
			return cached.data;
		}

		// Fetch company data in one go
		const { user: dbUser, companyData } = await getUserCompanyData(
			session.user.email,
		);

		const enhancedSession: EnhancedSession = {
			user: {
				id: session.user.id,
				email: session.user.email!,
				name: session.user.name || "User",
				role: session.user.role,
				companyId: dbUser?.companyId,
				hasCompany: !!(
					dbUser?.companyId && companyData
				),
				companyData,
			},
		};

		// Cache the result
		sessionCache.set(cacheKey, {
			data: enhancedSession,
			timestamp: Date.now(),
		});

		return enhancedSession;
	} catch (error) {
		console.error("Error getting enhanced session:", error);
		return null;
	}
}

// Clear cache when user data changes
export function clearSessionCache(email: string) {
	sessionCache.delete(email);
}

// Clear all cache (useful for testing)
export function clearAllSessionCache() {
	sessionCache.clear();
}
