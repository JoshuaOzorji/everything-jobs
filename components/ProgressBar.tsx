"use client";

import { Suspense } from "react";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { Progress } from "@/components/ui/progress";
import { usePathname, useSearchParams } from "next/navigation";

const ProgressBar = () => {
	const [progress, setProgress] = useState(0);
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const startLoading = useCallback(() => {
		if (!timeoutRef.current) {
			setProgress(30);
		}
	}, []);

	const completeLoading = useCallback(() => {
		setProgress(100);

		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}

		timeoutRef.current = setTimeout(() => {
			setProgress(0);
			timeoutRef.current = null;
		}, 500);
	}, []);

	// Watch for navigation changes
	useEffect(() => {
		startLoading();
		requestAnimationFrame(() => {
			setTimeout(completeLoading, 500);
		});
	}, [pathname, searchParams, startLoading, completeLoading]);

	// Handle link clicks
	useEffect(() => {
		const handleLinkClick = (e: MouseEvent) => {
			const target = e.target as HTMLElement;
			const link = target.closest("a");

			if (link?.getAttribute("href")?.match(/^\/|^[^:]+$/)) {
				startLoading();
			}
		};

		document.addEventListener("click", handleLinkClick);

		return () => {
			document.removeEventListener("click", handleLinkClick);
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, [startLoading]);

	if (progress === 0) return null;

	return (
		<Suspense fallback={null}>
			<Progress
				value={progress}
				className='fixed top-0 left-0 z-50 w-full h-1 bg-acc progress-bar'
			/>
		</Suspense>
	);
};

export default ProgressBar;
