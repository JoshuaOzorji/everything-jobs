// "use client";

// import { Suspense } from "react";
// import React, { useState, useEffect, useCallback, useRef } from "react";
// import { Progress } from "@/components/ui/progress";
// import { usePathname, useSearchParams } from "next/navigation";

// const ProgressBar = () => {
// 	const [progress, setProgress] = useState(0);
// 	const timeoutRef = useRef<NodeJS.Timeout | null>(null);
// 	const pathname = usePathname();
// 	const searchParams = useSearchParams();

// 	const startLoading = useCallback(() => {
// 		if (!timeoutRef.current) {
// 			setProgress(30);
// 		}
// 	}, []);

// 	const completeLoading = useCallback(() => {
// 		setProgress(100);

// 		if (timeoutRef.current) {
// 			clearTimeout(timeoutRef.current);
// 		}

// 		timeoutRef.current = setTimeout(() => {
// 			setProgress(0);
// 			timeoutRef.current = null;
// 		}, 500);
// 	}, []);

// 	// Watch for navigation changes
// 	useEffect(() => {
// 		startLoading();
// 		requestAnimationFrame(() => {
// 			setTimeout(completeLoading, 500);
// 		});
// 	}, [pathname, searchParams, startLoading, completeLoading]);

// 	// Handle link clicks
// 	useEffect(() => {
// 		const handleLinkClick = (e: MouseEvent) => {
// 			const target = e.target as HTMLElement;
// 			const link = target.closest("a");

// 			if (link?.getAttribute("href")?.match(/^\/|^[^:]+$/)) {
// 				startLoading();
// 			}
// 		};

// 		document.addEventListener("click", handleLinkClick);

// 		return () => {
// 			document.removeEventListener("click", handleLinkClick);
// 			if (timeoutRef.current) {
// 				clearTimeout(timeoutRef.current);
// 			}
// 		};
// 	}, [startLoading]);

// 	if (progress === 0) return null;

// 	return (
// 		<Suspense fallback={null}>
// 			<Progress
// 				value={progress}
// 				className='fixed top-0 left-0 z-50 w-full h-1 bg-acc progress-bar'
// 			/>
// 		</Suspense>
// 	);
// };

// export default ProgressBar;

"use client";

import { Suspense } from "react";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { Progress } from "@/components/ui/progress";
import { usePathname, useSearchParams } from "next/navigation";

const ProgressBar = () => {
	const [progress, setProgress] = useState(0);
	const intervalRef = useRef<NodeJS.Timeout | null>(null);
	const pathname = usePathname();
	const searchParams = useSearchParams();

	// Function to start the loading animation
	const startLoading = useCallback(() => {
		if (!intervalRef.current) {
			setProgress(0); // Reset progress before starting
			let currentProgress = 0;

			intervalRef.current = setInterval(() => {
				currentProgress += Math.random() * 20; // Increment randomly
				if (currentProgress >= 90) {
					currentProgress = 90; // Cap at 90% to simulate incomplete loading
					clearInterval(
						intervalRef.current as NodeJS.Timeout,
					);
					intervalRef.current = null;
				}
				setProgress(currentProgress);
			}, 200); // Adjust speed of progress bar
		}
	}, []);

	// Function to complete the loading animation
	const completeLoading = useCallback(() => {
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}

		setProgress(100); // Complete the progress bar

		setTimeout(() => {
			setProgress(0); // Reset progress after a delay
		}, 500); // Delay before hiding the bar
	}, []);

	// Watch for navigation changes
	useEffect(() => {
		startLoading();

		// Simulate page load completion after a delay
		const timeout = setTimeout(completeLoading, 2000); // Adjust delay to match your loading time
		return () => clearTimeout(timeout);
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
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
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
