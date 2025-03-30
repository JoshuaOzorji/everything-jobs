import type { Metadata } from "next";
import { Lato, Poppins, Open_Sans, IBM_Plex_Serif } from "next/font/google";
import "./../globals.css";
import AuthProvider from "@/components/AuthProvider";
import { Toaster } from "react-hot-toast";
import BaseLayout from "@/components/BaseLayout";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";
import LoadingSpinner from "@/components/LoadingComponent";

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

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<body
				className={`${lato.variable} ${openSans.variable} ${poppins.variable}  antialiased`}>
				{/* <ErrorBoundary
					fallback={<>Something went wrong!</>}>
					<ProgressBar />
				</ErrorBoundary> */}

				<BaseLayout>
					<AuthProvider>
						<Suspense
							fallback={
								<LoadingSpinner />
							}>
							{children}
						</Suspense>
					</AuthProvider>
					<Toaster
						position='bottom-center'
						reverseOrder={false}
					/>
				</BaseLayout>
			</body>
		</html>
	);
}
