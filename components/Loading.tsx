"use client";

const LoadingSpinner = ({ size = "md" }) => {
	const sizeClass = `loading-${size}`;

	return (
		<div className='flex items-center justify-center h-full w-full'>
			<span
				className={`loading loading-spinner loading-sm text-pry ${sizeClass}`}
			/>
		</div>
	);
};

export function LoadingComponent() {
	return <LoadingSpinner />;
}
