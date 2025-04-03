"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Progress } from "@/components/ui/progress";
import { usePathname, useSearchParams } from "next/navigation";

const ProgressBar = () => {
	const [progress, setProgress] = useState(0);
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);
	const intervalRef = useRef<NodeJS.Timeout | null>(null);
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const [visible, setVisible] = useState(false);

	const startLoading = useCallback(() => {
		// Clear any existing timers
		if (timeoutRef.current) clearTimeout(timeoutRef.current);
		if (intervalRef.current) clearInterval(intervalRef.current);

		// Show the progress bar
		setVisible(true);
		setProgress(10); // Start with a small initial progress

		// Gradually increase progress
		intervalRef.current = setInterval(() => {
			setProgress((prev) => {
				if (prev >= 90) {
					// Don't go past 90% while waiting
					if (intervalRef.current)
						clearInterval(
							intervalRef.current,
						);
					return 90;
				}
				// Increment speed slows down as we approach 90%
				const increment = (90 - prev) / 10;
				return prev + Math.max(1, increment);
			});
		}, 100);
	}, []);

	const completeLoading = useCallback(() => {
		// Clear the interval that was incrementing progress
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}

		// Set to 100% complete
		setProgress(100);

		// Hide the progress bar after a short delay
		timeoutRef.current = setTimeout(() => {
			setVisible(false);
			// Reset progress after hiding
			setTimeout(() => setProgress(0), 100);
		}, 500);
	}, []);

	// Watch for navigation changes
	useEffect(() => {
		completeLoading();
	}, [pathname, searchParams, completeLoading]);

	// Handle link clicks
	useEffect(() => {
		const handleLinkClick = (e: MouseEvent) => {
			const target = e.target as HTMLElement;
			const link = target.closest("a");

			// Check if it's an internal navigation link
			if (link?.getAttribute("href")?.startsWith("/")) {
				startLoading();
			}
		};

		// Add click listener to the entire document
		document.addEventListener("click", handleLinkClick);

		return () => {
			document.removeEventListener("click", handleLinkClick);
			if (timeoutRef.current)
				clearTimeout(timeoutRef.current);
			if (intervalRef.current)
				clearInterval(intervalRef.current);
		};
	}, [startLoading]);

	// Don't render anything if progress is 0 or component is invisible
	if (!visible) return null;

	return (
		<Progress
			value={progress}
			className='fixed top-0 left-0 z-[9999] w-full h-1 bg-transparent '
		/>
	);
};

export default ProgressBar;
