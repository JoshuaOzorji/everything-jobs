import React from "react";
import JobCard from "./JobCard";

const LatestJobs = () => {
	return (
		<main className=''>
			<h2 className='text-xl font-poppins'>Latest Jobs</h2>
			<div className='flex flex-col gap-4 md:flex-row'>
				<section className='md:w-[65%] bg-white'>
					<JobCard />
				</section>
				<aside className='md:w-[35%] bg-white'>
					Right
				</aside>
			</div>
		</main>
	);
};

export default LatestJobs;
