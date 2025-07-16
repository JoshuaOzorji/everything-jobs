"use client";

import Image from "next/image";

interface CompanyLogoUploadProps {
	logoPreview: string | null;
	isEditMode: boolean;
	onLogoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function CompanyLogoUpload({
	logoPreview,
	isEditMode,
	onLogoChange,
}: CompanyLogoUploadProps) {
	return (
		<div className='flex items-start gap-6'>
			<div className='flex-shrink-0'>
				<div className='w-20 h-20 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden'>
					{logoPreview ? (
						<Image
							src={logoPreview}
							alt='Company Logo'
							width={80}
							height={80}
							className='w-full h-full object-cover rounded-lg'
						/>
					) : (
						<svg
							className='w-8 h-8 text-gray-400'
							fill='none'
							stroke='currentColor'
							viewBox='0 0 24 24'>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 8h1m-1-4h1m4 4h1m-1-4h1'
							/>
						</svg>
					)}
				</div>
			</div>
			<div className='flex-1'>
				<label className='block text-sm font-medium text-gray-700 mb-2'>
					Company Logo
				</label>
				{isEditMode ? (
					<input
						type='file'
						accept='image/*'
						onChange={onLogoChange}
						className='block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-colors'
					/>
				) : (
					<p className='text-sm text-gray-500 bg-gray-50 rounded-lg px-3 py-2'>
						{logoPreview
							? "Logo uploaded"
							: "No logo uploaded"}
					</p>
				)}
			</div>
		</div>
	);
}
