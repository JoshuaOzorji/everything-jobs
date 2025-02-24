import React from "react";

const Hero = () => {
	return (
		<div className='bg-pry text-white text-xl h-[30vh]'>
			<div className='mx-4 my-2 md:my-4 md:mx-8'>
				<div className='bg-acc2 p-4 rounded-lg'>
					<span>
						<input
							type='search'
							name=''
							placeholder='Job Title or Company Name'
							className='rounded-lg text-base w-full p-2'
							// onChange={
							// 	handleInputChange
							// }
							// value={
							// 	formData.identifier
							// }
						/>
					</span>

					<span>
						<input
							type='text'
							name=''
							placeholder='Job Title or Company Name'
							className='rounded-lg text-base w-full p-2'
							// onChange={
							// 	handleInputChange
							// }
							// value={
							// 	formData.identifier
							// }
						/>
					</span>

					<span>
						<input
							type='text'
							name=''
							placeholder='Job Title or Company Name'
							className='rounded-lg text-base w-full p-2'
							// onChange={
							// 	handleInputChange
							// }
							// value={
							// 	formData.identifier
							// }
						/>
					</span>

					<span>
						<input type='submit' />
					</span>
				</div>
			</div>
		</div>
	);
};

export default Hero;
