"use client";

import { LoadingComponent } from "@/components/Loading";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Dashboard() {
	const { data: session, status } = useSession();
	const router = useRouter();

	useEffect(() => {
		if (status === "unauthenticated") {
			router.replace("/auth/login");
		}
	}, [status, router]);

	if (status === "loading") {
		return <LoadingComponent />;
	}

	if (!session) {
		return null;
	}

	return (
		<div className='min-h-screen'>
			<h1>Welcome, {session.user?.name}</h1>
			<button onClick={() => signOut()}>Sign Out</button>
		</div>
	);
}
