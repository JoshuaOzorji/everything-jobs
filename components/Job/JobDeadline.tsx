import { MdErrorOutline } from "react-icons/md";
import { formatDate2 } from "@/lib/formatDate2";

interface JobDeadlineProps {
	deadline?: string;
}

export default function JobDeadline({ deadline }: JobDeadlineProps) {
	if (!deadline) return null;

	return (
		<div className='flex justify-center w-full mt-4 font-openSans'>
			<div className='icon-container'>
				{new Date(deadline) > new Date() ? (
					<>
						<span className='text-red-500'>
							Deadline:
						</span>{" "}
						{formatDate2(
							new Date(deadline),
						)}
					</>
				) : (
					<span className='text-white bg-red-500 px-2 py-0.5 rounded-md flex items-center gap-1 font-normal'>
						<MdErrorOutline />
						<p>Job Expired</p>
					</span>
				)}
			</div>
		</div>
	);
}
