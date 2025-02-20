import type { Metadata } from "next";
import { Geist, Geist_Mono, Markazi_Text, Poppins } from "next/font/google";
import "./../globals.css";
import AuthProvider from "@/components/AuthProvider";
import { Suspense } from "react";
import { Toaster } from "react-hot-toast";
import ProgressBar from "@/components/ProgressBar";
import BaseLayout from "@/components/BaseLayout";
import { ErrorBoundary } from "react-error-boundary";

export const metadata: Metadata = {
	title: "Everything Jobs",
	description: "Find your dream job",
};

const poppins = Poppins({
	variable: "--font-poppins",
	subsets: ["latin"],
	weight: "400",
});

const markaziText = Markazi_Text({
	variable: "--font-markazi-text",
	subsets: ["latin"],
});

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<body
				className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} ${markaziText.variable} antialiased`}>
				<ErrorBoundary
					fallback={<p>Something went wrong!</p>}>
					<ProgressBar />
				</ErrorBoundary>

				<BaseLayout>
					<AuthProvider>{children}</AuthProvider>
					<Toaster
						position='bottom-center'
						reverseOrder={false}
					/>
				</BaseLayout>
			</body>
		</html>
	);
}
