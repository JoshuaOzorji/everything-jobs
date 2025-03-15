import React from "react";

const LoadingSpinner: React.FC = () => {
	return (
		<div className='flex items-center justify-center min-h-[300px]'>
			<div className='w-12 h-12 border-t-2 border-b-2 rounded-full border-pry animate-spin'></div>
		</div>
	);
};

export default LoadingSpinner;
