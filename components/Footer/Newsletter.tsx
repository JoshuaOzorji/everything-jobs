import { useForm } from "react-hook-form";

interface FormData {
	email: string;
}

const Newsletter = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormData>();

	const onSubmit = (data: FormData): void => {
		console.log(data);
	};

	return (
		<div>
			{/* Heading */}
			<h3 className='footer-h2 text-center md:text-left'>
				Stay Updated
			</h3>
			<p className='mb-4 text-myBlack text-center md:text-left'>
				Subscribe to our newsletter for the latest job
				opportunities and career insights.
			</p>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className='space-y-3'>
				<div>
					<label
						htmlFor='email'
						className='sr-only'>
						Email address
					</label>
					<input
						id='email'
						type='email'
						placeholder='Your email address'
						className='w-full p-2 bg-white border border-gray-700 rounded text-myBlack focus:outline-none'
						{...register("email", {
							required: "Email is required",
							pattern: {
								value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
								message: "Invalid email address",
							},
						})}
					/>
					{errors.email && (
						<p className='mt-1 text-sm text-red-400'>
							{typeof errors.email
								?.message ===
								"string" &&
								errors.email
									.message}
						</p>
					)}
				</div>
				<button
					type='submit'
					className='w-full px-4 py-2 font-medium text-white transition bg-blue-600 rounded hover:bg-blue-700'>
					Subscribe
				</button>
			</form>
		</div>
	);
};

export default Newsletter;
