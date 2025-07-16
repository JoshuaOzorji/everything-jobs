"use client";

interface CompanyProfileHeaderProps {
	isUpdate: boolean;
	isEditMode: boolean;
	onEditToggle: () => void;
}

export function CompanyProfileHeader({
	isUpdate,
	isEditMode,
	onEditToggle,
}: CompanyProfileHeaderProps) {
	if (!isUpdate) return null;

	return (
		<div className='py-2'>
			<div className='flex items-center justify-end'>
				<button
					onClick={onEditToggle}
					className='px-4 py-2 bg-white/20 hover:bg-white/30 text-black rounded-lg transition-colors duration-200 text-sm font-medium flex items-center gap-2'>
					{isEditMode ? (
						<>
							<svg
								className='w-4 h-4'
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={
										2
									}
									d='M6 18L18 6M6 6l12 12'
								/>
							</svg>
							Cancel Edit
						</>
					) : (
						<>
							<svg
								className='w-4 h-4'
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={
										2
									}
									d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
								/>
							</svg>
							Edit Profile
						</>
					)}
				</button>
			</div>
		</div>
	);
}
