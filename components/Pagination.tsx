import { useState } from "react";

// Add to your search page
const [currentPage, setCurrentPage] = useState(1);
const jobsPerPage = 10;

// Calculate pagination
const indexOfLastJob = currentPage * jobsPerPage;
const indexOfFirstJob = indexOfLastJob - jobsPerPage;
const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);
const totalPages = Math.ceil(jobs.length / jobsPerPage);

const Pagination = () => {
	return (
		<div className='flex justify-center mt-6 gap-2'>
			<button
				onClick={() => setCurrentPage(currentPage - 1)}
				disabled={currentPage === 1}
				className={`px-3 py-1 rounded ${
					currentPage === 1
						? "bg-gray-200 text-gray-500"
						: "bg-pry text-white"
				}`}>
				Previous
			</button>

			{Array.from(
				{ length: totalPages },
				(_, i) => i + 1,
			).map((page) => (
				<button
					key={page}
					onClick={() => setCurrentPage(page)}
					className={`px-3 py-1 rounded ${
						currentPage === page
							? "bg-pry text-white"
							: "bg-gray-200"
					}`}>
					{page}
				</button>
			))}

			<button
				onClick={() => setCurrentPage(currentPage + 1)}
				disabled={currentPage === totalPages}
				className={`px-3 py-1 rounded ${
					currentPage === totalPages
						? "bg-gray-200 text-gray-500"
						: "bg-pry text-white"
				}`}>
				Next
			</button>
		</div>
	);
};

// Use currentJobs instead of jobs when rendering
// Add the pagination component below the job listings
