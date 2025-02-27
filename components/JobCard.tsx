import image from "@/public/mtn-new-logo.jpg";
import Image from "next/image";

const JobCard = () => {
	return (
		<div className='flex p-2 gap-3 items-start'>
			<div>
				<Image
					src={image}
					alt='image'
					className='h-[8vh] w-full rounded-sm bg-red-500'
				/>
			</div>
			<div className='w-full '>
				<span className='flex justify-between items-center font-poppins'>
					<h2 className=' text-lg font-bold'>
						Product Designer
					</h2>
					<p className='text-sm'>
						<span className='mx-1 text-green-500'>
							&bull;
						</span>
						1hr ago
					</p>
				</span>
				<div className='flex gap-2 font-sourceSans3'>
					<p>MTN-NG</p>
					<span>&bull;</span>
					<p className='flex'>
						Lagos <span> ,NG</span>
					</p>
				</div>
				<div className='flex gap-4 flex-wrap font-sourceSans3'>
					<span>
						<p className='underline'>
							Full-time
						</p>
						<p className='underline'>
							Entry-level
						</p>
					</span>

					<span></span>
				</div>
			</div>
		</div>
	);
};

export default JobCard;
