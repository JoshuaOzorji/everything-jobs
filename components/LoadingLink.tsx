"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { LoadingComponent } from "@/components/Loading";

interface LoadingLinkProps {
	href: string;
	children: React.ReactNode;
	className?: string;
}

export default function LoadingLink({
	href,
	children,
	className = "",
}: LoadingLinkProps) {
	const [isLoading, setIsLoading] = useState(false);
	const pathname = usePathname();
	const searchParams = useSearchParams();

	// Reset loading state when navigation completes
	useEffect(() => {
		setIsLoading(false);
	}, [pathname, searchParams]);

	const handleClick = () => {
		setIsLoading(true);
	};

	return (
		<Link
			href={href}
			className={`${className} relative`}
			onClick={handleClick}>
			{children}
			{isLoading && (
				<span className='absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-black/50'>
					<LoadingComponent />
				</span>
			)}
		</Link>
	);
}
