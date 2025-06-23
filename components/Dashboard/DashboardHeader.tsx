"use client";

import { useSession, signOut } from "next-auth/react";
import Image from "next/image";

const DashboardHeader = () => {
	const { data: session } = useSession();

	return (
		<header className='px-6 py-4 bg-white border-b border-gray-200'>
			<div className='flex items-center justify-between'>
				<h2 className='text-xl font-semibold text-gray-800'>
					Dashboard
				</h2>

				<div className='flex items-center gap-4'>
					{session?.user && (
						<div className='flex items-center gap-3'>
							{session.user.image ? (
								<Image
									src={
										session
											.user
											.image
									}
									alt='Profile'
									width={
										32
									}
									height={
										32
									}
									className='rounded-full'
								/>
							) : (
								<div className='flex items-center justify-center w-8 h-8 text-white bg-blue-600 rounded-full'>
									{session.user.email?.[0].toUpperCase()}
								</div>
							)}
							<span className='text-gray-700'>
								{
									session
										.user
										.email
								}
							</span>
							<button
								onClick={() =>
									signOut()
								}
								className='text-sm text-red-600 hover:text-red-700'>
								Sign out
							</button>
						</div>
					)}
				</div>
			</div>
		</header>
	);
};

export default DashboardHeader;
