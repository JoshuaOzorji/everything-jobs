"use client";

import { useRouter } from "next/navigation";
import { Building2, ArrowLeft, Plus } from "lucide-react";

interface CompanyRequiredMessageProps {
	title?: string;
	message?: string;
}

export default function CompanyRequiredMessage({
	title = "Company Profile Required",
	message = "You need to create a company profile before posting jobs.",
}: CompanyRequiredMessageProps) {
	const router = useRouter();

	const handleCreateCompany = () => {
		router.push("/dashboard/company");
	};

	const handleGoBack = () => {
		router.back();
	};

	return (
		<div className='dashboard-page-container'>
			<div className='max-w-md mx-auto text-center'>
				<div className='bg-white rounded-lg border border-gray-200 p-8 shadow-sm'>
					{/* Icon */}
					<div className='flex justify-center mb-6'>
						<div className='w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center'>
							<Building2 className='w-8 h-8 text-blue-600' />
						</div>
					</div>

					{/* Title */}
					<h2 className='text-xl font-semibold text-gray-900 mb-4'>
						{title}
					</h2>

					{/* Message */}
					<p className='text-gray-600 mb-8 leading-relaxed'>
						{message}
					</p>

					{/* Action Buttons */}
					<div className='space-y-3'>
						<button
							onClick={
								handleCreateCompany
							}
							className='w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-pry hover:bg-pry2 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pry transition-colors'>
							<Plus className='w-4 h-4 mr-2' />
							Create Company Profile
						</button>

						<button
							onClick={handleGoBack}
							className='w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pry transition-colors'>
							<ArrowLeft className='w-4 h-4 mr-2' />
							Go Back
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
