"use client";

import { LoadingComponent } from "@/components/Loading";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
	const { data: session, status } = useSession();
	const router = useRouter();

	// Handle different states declaratively
	if (status === "loading") {
		return <LoadingComponent />;
	}

	if (status === "unauthenticated") {
		// Redirect immediately and return null
		router.replace("/auth/login");
		return null;
	}

	if (!session) {
		// Fallback safety check
		router.replace("/auth/login");
		return null;
	}

	return (
		<div className='min-h-screen'>
			<h1>Welcome, {session.user?.name}</h1>
			<button onClick={() => signOut()}>Sign Out</button>
		</div>
	);
}
