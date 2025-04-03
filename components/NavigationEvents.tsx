"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Progress } from "@/components/ui/progress";

export default function NavigationEvents() {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const [isNavigating, setIsNavigating] = useState(false);
	const [progress, setProgress] = useState(0);

	useEffect(() => {
		let progressInterval: NodeJS.Timeout;

		// When navigation starts, show progress indicator
		const handleRouteChangeStart = () => {
			setIsNavigating(true);
			setProgress(0);

			// Simulate progress increase
			progressInterval = setInterval(() => {
				setProgress((prev) => {
					// Increase gradually but never reach 100% until complete
					if (prev < 90) {
						return prev + (90 - prev) / 10;
					}
					return prev;
				});
			}, 200);
		};

		// When navigation is complete, finish the progress
		const handleRouteChangeComplete = () => {
			setProgress(100);
			// Small delay to show the completed progress before hiding
			setTimeout(() => {
				clearInterval(progressInterval);
				setIsNavigating(false);
			}, 200);
		};

		// We can add event listeners for click events on all anchor tags
		const handleLinkClick = () => {
			handleRouteChangeStart();
		};

		// Add click listeners to all navigation links
		const navLinks = document.querySelectorAll('a[href^="/"]');
		navLinks.forEach((link) => {
			link.addEventListener("click", handleLinkClick);
		});

		// Clean up
		return () => {
			clearInterval(progressInterval);
			navLinks.forEach((link) => {
				link.removeEventListener(
					"click",
					handleLinkClick,
				);
			});
		};
	}, []);

	// This effect will run when path or search params change
	// and complete the navigation sequence
	useEffect(() => {
		setProgress(100);
		// Short delay to show completed progress before hiding
		const timer = setTimeout(() => {
			setIsNavigating(false);
		}, 200);

		return () => clearTimeout(timer);
	}, [pathname, searchParams]);

	if (!isNavigating) return null;

	return (
		<div className='fixed top-0 left-0 right-0 z-50'>
			<Progress value={progress} className='h-1' />
		</div>
	);
}
