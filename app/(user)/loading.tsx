"use client";

const LoadingSpinner = ({ size = "md" }) => {
	const sizeClass = `loading-${size}`;

	return (
		<div className='fixed inset-0 z-50 flex flex-col items-center justify-center'>
			{/* <div className='fixed inset-0 z-50 flex items-center justify-center w-screen h-screen bg-white'> */}
			<span
				className={`loading loading-spinner loading-md text-pry ${sizeClass}`}
			/>
		</div>
	);
};

export default function Loading() {
	return <LoadingSpinner />;
}
