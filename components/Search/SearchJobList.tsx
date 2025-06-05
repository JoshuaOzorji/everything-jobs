import React from "react";
import { SearchJobResult } from "@/types/types";
import JobCard2 from "./JobCard2";

interface JobListProps {
	jobs: SearchJobResult[];
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
