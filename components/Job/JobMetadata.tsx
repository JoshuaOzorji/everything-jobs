import { IoIosCash } from "react-icons/io";
import { IoBriefcase } from "react-icons/io5";
import { PiBuildingsFill } from "react-icons/pi";
import { RiMedalFill } from "react-icons/ri";
import { RiUserStarFill } from "react-icons/ri";
import { FaGraduationCap } from "react-icons/fa";
import { Job } from "@/types/types";
import { getDisplayNameForEducation } from "@/sanity/lib/utility";
import { getDisplayNameForJobLevel } from "@/sanity/lib/utility";
import { getDisplayNameForJobField } from "@/sanity/lib/utility";

interface JobMetadataProps {
	job: Job;
}

export default function JobMetadata({ job }: JobMetadataProps) {
	return (
		<>
			{(job.experienceRange?.min != null ||
				job.experienceRange?.max != null) && (
				<p className='icon-container2'>
					<RiMedalFill className='icon' />
					<span>Experience:</span>{" "}
					{job.experienceRange?.min ?? 0} -{" "}
					{job.experienceRange?.max ?? 0}+ years
				</p>
			)}

			{job.salaryRange?.min && job.salaryRange?.max && (
				<div className='icon-container'>
					<IoIosCash className='icon' />
					<span>Pay:</span>
					<p>
						₦
						{job.salaryRange.min.toLocaleString()}{" "}
						- ₦
						{job.salaryRange.max.toLocaleString()}
					</p>
				</div>
			)}

			<div className='icon-container'>
				<IoBriefcase className='icon' />
				<span>Job-Type:</span>
				<p className='job-input'>{job.jobType?.name}</p>
			</div>

			<div className='icon-container'>
				<PiBuildingsFill className='icon' />
				<span>Job Field:</span>
				<p className='job-input'>
					{getDisplayNameForJobField(
						job.jobField?.name,
					)}
				</p>
			</div>

			{job.level && (
				<div className='icon-container2'>
					<RiUserStarFill className='icon' />
					<span>Career Levels: </span>
					<p className='job-input'>
						{getDisplayNameForJobLevel(
							job.level?.name,
						)}
					</p>
				</div>
			)}

			{job.education && (
				<div className='icon-container2'>
					<FaGraduationCap className='icon' />
					<span>Qualification:</span>
					<p className='job-input'>
						{getDisplayNameForEducation(
							job.education.name,
						)}
					</p>
				</div>
			)}
		</>
	);
}
