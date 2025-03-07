import type { Metadata } from "next";
import { Lato, Poppins, IBM_Plex_Sans, IBM_Plex_Serif } from "next/font/google";
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

const lato = Lato({
	variable: "--font-lato",
	subsets: ["latin"],
	weight: "400",
});

const plex_serif = IBM_Plex_Serif({
	variable: "--font-plex-serif",
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
				className={`${lato.variable} ${plex_serif.variable} ${poppins.variable}  antialiased`}>
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
