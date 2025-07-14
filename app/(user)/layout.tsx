import type { Metadata } from "next";
import { Lato, Poppins, Open_Sans } from "next/font/google";
import "./../globals.css";
import AuthProvider from "@/components/AuthProvider";
import { Toaster } from "sonner";
import BaseLayout from "@/components/BaseLayout";
import { Suspense } from "react";
import ProgressBar from "@/components/ProgressBar";
import { getEnhancedSession } from "@/lib/sessionUtils";

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
	// Get enhanced session with company data in one call
	const enhancedSession = await getEnhancedSession();

	return (
		<html lang='en'>
			<body
				className={`${lato.variable} ${openSans.variable} ${poppins.variable}  antialiased`}>
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
			</body>
		</html>
	);
}
