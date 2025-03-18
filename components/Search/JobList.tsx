import React from "react";
import { JobQuery } from "@/types";
import JobCard from "./JobCard2";

interface JobListProps {
	jobs: JobQuery[];
}

const JobList: React.FC<JobListProps> = ({ jobs }) => {
	return (
		<div className='grid gap-2'>
			{jobs.map((job) => (
				<JobCard key={job._id} job={job} />
			))}
		</div>
	);
};

export default JobList;
