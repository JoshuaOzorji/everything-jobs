import type { Metadata } from "next";
import {
	Markazi_Text,
	Poppins,
	Roboto,
	PT_Sans,
	Inter,
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

const roboto = Roboto({
	variable: "--font-roboto-text",
	weight: "400",
	subsets: ["latin"],
});

const pt_sans = PT_Sans({
	variable: "--font-pt-sans",
	subsets: ["latin"],
	weight: "400",
});

const inter = Inter({
	variable: "--font-inter",
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
				className={`${roboto.variable} ${inter.variable} ${pt_sans.variable} ${poppins.variable} ${markaziText.variable} antialiased`}>
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
