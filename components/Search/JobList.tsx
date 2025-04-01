import React from "react";
import { JobQuery } from "@/types";
import JobCard2 from "./JobCard2";

interface JobListProps {
	jobs: JobQuery[];
}

const JobList: React.FC<JobListProps> = ({ jobs }) => {
	return (
		<div className='grid gap-2'>
			{jobs.map((job) => (
				<JobCard2 key={job._id} job={job} />
			))}
		</div>
	);
};

export default JobList;
