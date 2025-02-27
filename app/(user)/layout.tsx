import type { Metadata } from "next";
import {
	Markazi_Text,
	Poppins,
	Crimson_Text,
	Source_Sans_3,
} from "next/font/google";
import "./../globals.css";
import AuthProvider from "@/components/AuthProvider";
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

const crimsonText = Crimson_Text({
	variable: "--font-crimson-text",
	subsets: ["latin"],
	weight: "400",
});

const sourceSans3 = Source_Sans_3({
	variable: "--font-source-sans-3",
	subsets: ["latin"],
	weight: "400",
});
export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<body
				className={`${crimsonText.variable} ${sourceSans3.variable} ${poppins.variable} ${markaziText.variable} antialiased`}>
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
