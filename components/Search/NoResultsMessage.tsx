import React from "react";
import { useRouter } from "next/navigation";

const NoResultsMessage: React.FC = () => {
	const router = useRouter();

	return (
		<div className='p-8 text-center bg-white rounded shadow'>
			<h3 className='mb-2 text-xl font-semibold'>
				No jobs found
			</h3>
			<p className='text-gray-600'>
				Try adjusting your search criteria or browse all
				available jobs.
			</p>
			<button
				onClick={() => router.push("/")}
				className='px-4 py-2 mt-4 text-white rounded bg-pry hover:bg-sec'>
				View All Jobs
			</button>
		</div>
	);
};

export default NoResultsMessage;
