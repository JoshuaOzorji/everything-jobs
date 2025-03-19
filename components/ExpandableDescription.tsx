"use client";

import { useState, useRef, useEffect } from "react";

interface ExpandableDescriptionProps {
	description: string;
}

const ExpandableDescription = ({ description }: ExpandableDescriptionProps) => {
	const [expanded, setExpanded] = useState(false);
	const [isOverflowing, setIsOverflowing] = useState(false);
	const textRef = useRef<HTMLParagraphElement>(null);

	useEffect(() => {
		const checkOverflow = () => {
			const element = textRef.current;
			if (!element) return;

			// Get computed styles
			const lineHeight = parseInt(
				window.getComputedStyle(element).lineHeight,
			);
			const height = element.scrollHeight;

			// If lineHeight is returned as 'normal' or 'auto', use approximation
			const lineHeightValue = isNaN(lineHeight)
				? parseInt(
						window.getComputedStyle(element)
							.fontSize,
					) * 1.2
				: lineHeight;

			// Check if text height exceeds 3 lines
			const threeLineHeight = lineHeightValue * 3;

			setIsOverflowing(height > threeLineHeight);
		};

		checkOverflow();

		// Re-check on window resize
		window.addEventListener("resize", checkOverflow);
		return () =>
			window.removeEventListener("resize", checkOverflow);
	}, [description]);

	const toggleExpanded = () => {
		setExpanded(!expanded);
	};

	return (
		<div>
			<p
				ref={textRef}
				className={`text-gray-700 text-sm ${!expanded ? "line-clamp-3" : ""}`}>
				{description}
			</p>
			{isOverflowing && (
				<button
					onClick={toggleExpanded}
					className='text-pry2 hover:underline text-xs mt-1 focus:outline-none'>
					{expanded ? "Show less" : "Read more"}
				</button>
			)}
		</div>
	);
};

export default ExpandableDescription;
