import { ImLocation } from "react-icons/im";
import { Job } from "@/types/types";
import JobMetadata from "./JobMetadata";
import JobDeadline from "./JobDeadline";

interface JobBasicInfoProps {
	job: Job;
}

export default function JobBasicInfo({ job }: JobBasicInfoProps) {
	return (
		<div className='space-y-1 text-sm font-saira md:text-base'>
			<div className='icon-container'>
				<ImLocation className='icon' />
				<span>Location: </span>
				<p>{job.location?.name}</p>
			</div>

			<JobMetadata job={job} />
			<JobDeadline deadline={job.deadline} />
		</div>
	);
}
