"use client";

interface SubmitButtonProps {
	isSubmitting: boolean;
}

export default function SubmitButton({ isSubmitting }: SubmitButtonProps) {
	return (
		<button
			type='submit'
			disabled={isSubmitting}
			className='w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300'>
			{isSubmitting ? "Submitting..." : "Submit Job"}
		</button>
	);
}
