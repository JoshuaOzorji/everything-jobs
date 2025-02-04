"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
	const { data: session } = useSession();
	const router = useRouter();

	if (!session) {
		router.push("/auth/sign-in");
		return null;
	}

	return (
		<div>
			<h1>Welcome, {session.user?.name}</h1>
			<button onClick={() => signOut()}>Sign Out</button>
		</div>
	);
}
