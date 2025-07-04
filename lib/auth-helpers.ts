import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/config";
import clientPromise from "@/lib/mongoClient";

export async function getEnhancedSession() {
	const session = await getServerSession(authOptions);

	if (!session?.user?.email) {
		return null;
	}

	// Fetch latest user data from MongoDB
	const db = (await clientPromise).db();
	const user = await db
		.collection("users")
		.findOne({ email: session.user.email });

	return {
		...session,
		user: {
			...session.user,
			companyId: user?.companyId || null,
			role: user?.role || session.user.role,
		},
	};
}
