"use client";

const LoadingSpinner = ({ size = "md" }) => {
	const sizeClass = `loading-${size}`;

	return (
		<div className='flex-1 flex flex-col items-center justify-center min-h-screen'>
			<span
				className={`loading loading-spinner loading-md text-pry ${sizeClass}`}
			/>
		</div>
	);
};

export default function Loading() {
	return <LoadingSpinner />;
}
