// layout.tsx
import type { Metadata } from "next";
import { Lato, Poppins, Open_Sans } from "next/font/google";
import "./../globals.css";
import AuthProvider from "@/components/AuthProvider";
import { Toaster } from "sonner";
import BaseLayout from "@/components/BaseLayout";
import { Suspense } from "react";
import ProgressBar from "@/components/ProgressBar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/config";

export const metadata: Metadata = {
	title: "Everything Jobs",
	description: "Find your dream job",
};

const poppins = Poppins({
	variable: "--font-poppins",
	subsets: ["latin"],
	weight: "400",
});

const lato = Lato({
	variable: "--font-lato",
	subsets: ["latin"],
	weight: "400",
});

const openSans = Open_Sans({
	variable: "--font-open-sans",
	subsets: ["latin"],
	weight: "400",
});

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	// Get server session to prevent navbar flickering
	const session = await getServerSession(authOptions);

	return (
		<html lang='en'>
			<body
				className={`${lato.variable} ${openSans.variable} ${poppins.variable}  antialiased`}>
				<AuthProvider>
					<Suspense fallback={null}>
						<ProgressBar />
					</Suspense>

					<BaseLayout initialSession={session}>
						{children}
						<Toaster
							richColors
							position='bottom-center'
						/>
					</BaseLayout>
				</AuthProvider>
			</body>
		</html>
	);
}
