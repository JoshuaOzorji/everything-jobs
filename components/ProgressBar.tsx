"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Progress } from "@/components/ui/progress";
import { usePathname, useSearchParams } from "next/navigation";

const ProgressBar = () => {
	const [progress, setProgress] = useState(0);
	const [visible, setVisible] = useState(false);
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);
	const intervalRef = useRef<NodeJS.Timeout | null>(null);
	const pathname = usePathname();
	const searchParams = useSearchParams();

	// Centralized cleanup function
	const cleanup = useCallback(() => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
			timeoutRef.current = null;
		}
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}
	}, []);

	const startLoading = useCallback(() => {
		cleanup();
		setVisible(true);
		setProgress(10);

		intervalRef.current = setInterval(() => {
			setProgress((prev) => {
				if (prev >= 90) {
					if (intervalRef.current) {
						clearInterval(
							intervalRef.current,
						);
						intervalRef.current = null;
					}
					return 90;
				}
				const increment = (90 - prev) / 10;
				return prev + Math.max(1, increment);
			});
		}, 100);
	}, [cleanup]);

	const completeLoading = useCallback(() => {
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}

		setProgress(100);

		timeoutRef.current = setTimeout(() => {
			setVisible(false);
			// Reset progress after a brief delay to allow fade out
			timeoutRef.current = setTimeout(
				() => setProgress(0),
				100,
			);
		}, 500);
	}, []);

	// Handle link clicks with event delegation (moved inside useEffect)
	const handleLinkClick = useCallback(
		(e: MouseEvent) => {
			const target = e.target as HTMLElement;
			const link = target.closest("a");

			// More robust check for internal navigation
			if (link) {
				const href = link.getAttribute("href");
				if (
					href?.startsWith("/") &&
					!link.hasAttribute("target")
				) {
					startLoading();
				}
			}
		},
		[startLoading],
	);

	// Single useEffect for navigation changes
	useEffect(() => {
		completeLoading();
	}, [pathname, searchParams, completeLoading]);

	// Single useEffect for click handling and cleanup
	useEffect(() => {
		document.addEventListener("click", handleLinkClick, {
			passive: true,
		});

		return () => {
			document.removeEventListener("click", handleLinkClick);
			cleanup();
		};
	}, [handleLinkClick, cleanup]);

	// Early return for better performance
	if (!visible) return null;

	return (
		<Progress
			value={progress}
			className='fixed top-0 left-0 z-[9999] w-full h-1 bg-transparent hidden md:block'
		/>
	);
};

export default ProgressBar;
