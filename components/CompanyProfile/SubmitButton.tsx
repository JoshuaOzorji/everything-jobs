"use client";

interface SubmitButtonProps {
	isSubmitting: boolean;
	isUpdate: boolean;
	isEditMode: boolean;
}

export function SubmitButton({
	isSubmitting,
	isUpdate,
	isEditMode,
}: SubmitButtonProps) {
	if (!isEditMode) return null;

	return (
		<div className='flex justify-end pt-4 border-t border-gray-200'>
			<button
				type='submit'
				disabled={isSubmitting}
				className='px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors duration-200 font-medium flex items-center gap-2'>
				{isSubmitting ? (
					<>
						<svg
							className='w-4 h-4 animate-spin'
							fill='none'
							viewBox='0 0 24 24'>
							<circle
								className='opacity-25'
								cx='12'
								cy='12'
								r='10'
								stroke='currentColor'
								strokeWidth='4'
							/>
							<path
								className='opacity-75'
								fill='currentColor'
								d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
							/>
						</svg>
						{isUpdate
							? "Updating..."
							: "Creating..."}
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
								strokeWidth={2}
								d='M5 13l4 4L19 7'
							/>
						</svg>
						{isUpdate
							? "Update Profile"
							: "Create Company"}
					</>
				)}
			</button>
		</div>
	);
}
