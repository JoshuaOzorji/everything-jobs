import type { Metadata } from "next";
import { Lato, Poppins, Saira } from "next/font/google";
import "./../globals.css";
import AuthProvider from "@/components/Providers/AuthProvider";
import { Toaster } from "sonner";
import BaseLayout from "@/components/BaseLayout";
import { Suspense } from "react";
import ProgressBar from "@/components/ProgressBar";
import { getEnhancedSession } from "@/lib/sessionUtils";
import QueryProvider from "@/components/Providers/QueryProvider";

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

const saira = Saira({
	variable: "--font-saira",
	subsets: ["latin"],
	weight: "400",
});

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	// Get enhanced session with company data in one call
	const enhancedSession = await getEnhancedSession();

	return (
		<html lang='en'>
			<body
				className={`${lato.variable} ${poppins.variable} ${saira.variable} antialiased`}>
				<QueryProvider>
					<AuthProvider
						initialSession={enhancedSession}
						hasCompany={
							enhancedSession?.user
								?.hasCompany
						}
						companyData={
							enhancedSession?.user
								?.companyData
						}>
						<Suspense fallback={null}>
							<ProgressBar />
						</Suspense>

						<BaseLayout>
							{children}
							<Toaster
								richColors
								position='bottom-center'
							/>
						</BaseLayout>
					</AuthProvider>
				</QueryProvider>
			</body>
		</html>
	);
}
