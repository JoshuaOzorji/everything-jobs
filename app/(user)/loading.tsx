"use client";

const LoadingSpinner = ({ size = "md" }) => {
	const sizeClass = `loading-${size}`;

	return (
		<div className='fixed inset-0 flex flex-col items-center justify-center bg-black/30 bg-opacity-80 z-50'>
			<span
				className={`loading loading-spinner text-pry ${sizeClass}`}
			/>
		</div>
	);
};

export default function Loading() {
	return <LoadingSpinner />;
}
