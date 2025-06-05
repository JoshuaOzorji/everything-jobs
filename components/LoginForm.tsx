"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { IoLogoLinkedin } from "react-icons/io";

export default function LoginForm() {
	const router = useRouter();
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setLoading(true);
		setError(null);

		const formData = new FormData(e.currentTarget);
		const email = formData.get("email") as string;
		const password = formData.get("password") as string;

		try {
			const result = await signIn("credentials", {
				redirect: false,
				email,
				password,
			});

			if (result?.error) {
				setError(result.error);
			} else {
				router.push("/dashboard");
				router.refresh();
			}
		} catch (error) {
			setError("An error occurred. Please try again.");
		} finally {
			setLoading(false);
		}
	}

	return (
		<form
			onSubmit={handleSubmit}
			className='mt-8 space-y-6 font-openSans'>
			{error && (
				<div className='p-3 text-sm text-red-500 rounded bg-red-50'>
					{error}
				</div>
			)}

			<div className='space-y-3 rounded-md shadow-sm'>
				<div>
					<label
						htmlFor='email'
						className='sr-only'>
						Email address
					</label>
					<input
						id='email'
						name='email'
						type='email'
						required
						className='relative block w-full p-3 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-none appearance-none rounded-t-md focus:outline-none focus:ring-pry focus:border-pry focus:z-10 sm:text-sm'
						placeholder='Email address'
					/>
				</div>
				<div>
					<label
						htmlFor='password'
						className='sr-only'>
						Password
					</label>
					<input
						id='password'
						name='password'
						type='password'
						required
						className='relative block w-full p-3 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-none appearance-none rounded-b-md focus:outline-none focus:ring-pry focus:border-pry focus:z-10 sm:text-sm'
						placeholder='Password'
					/>
				</div>
			</div>

			<div>
				<button
					type='submit'
					disabled={loading}
					className='relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md group bg-pry hover:bg-pry2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pry disabled:opacity-50'>
					{loading ? "Logging in..." : "Log in"}
				</button>
			</div>

			<div className='flex items-center justify-between'>
				<div className='text-sm'>
					<Link
						href='/auth/signup'
						className='text-pry hover:text-pry2'>
						Don't have an account? Sign up
					</Link>
				</div>
			</div>

			<div className='mt-6'>
				<div className='relative'>
					<div className='absolute inset-0 flex items-center'>
						<div className='w-full border-t border-gray-300' />
					</div>
					<div className='relative flex justify-center text-sm'>
						<span className='px-2 text-gray-500 bg-gray-50'>
							Or continue with
						</span>
					</div>
				</div>

				<div className='grid grid-cols-2 gap-3 mt-6'>
					<button
						onClick={() =>
							signIn("google", {
								callbackUrl:
									"/dashboard",
							})
						}
						type='button'
						className='social-icon'>
						<FcGoogle />
						<span>Google</span>
					</button>
					<button
						onClick={() =>
							signIn("linkedin", {
								callbackUrl:
									"/dashboard",
							})
						}
						type='button'
						className='social-icon'>
						<IoLogoLinkedin className='text-[#0077B5]' />
						<span>LinkedIn</span>
					</button>
				</div>
			</div>
		</form>
	);
}
