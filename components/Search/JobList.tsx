import React from "react";
import { JobQuery } from "@/types";
import JobCard from "./JobCard2";

interface JobListProps {
	jobs: JobQuery[];
	formatDate: (dateString: string) => string;
}

const JobList: React.FC<JobListProps> = ({ jobs, formatDate }) => {
	return (
		<div className='grid gap-4'>
			{jobs.map((job) => (
				<JobCard
					key={job._id}
					job={job}
					formatDate={formatDate}
				/>
			))}
		</div>
	);
};

export default JobList;
