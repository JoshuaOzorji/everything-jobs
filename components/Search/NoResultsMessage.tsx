// import React from "react";
// import { useRouter } from "next/navigation";

// const NoResultsMessage: React.FC = () => {
// 	const router = useRouter();

// 	return (
// 		<div className='p-8 text-center bg-white rounded shadow font-poppins'>
// 			<h3 className='mb-2 text-xl font-semibold'>
// 				No jobs found
// 			</h3>
// 			<p className='text-myBlack font-openSans'>
// 				Try adjusting your search criteria or browse all
// 				available jobs.
// 			</p>
// 			<button
// 				onClick={() => router.push("/search")}
// 				className='px-4 py-1 mt-4 text-white rounded bg-pry2 hover:bg-pry animate'>
// 				View All Jobs
// 			</button>
// 		</div>
// 	);
// };

// export default NoResultsMessage;

interface NoResultsMessageProps {
	hasSearched?: boolean;
	query?: string;
}

const NoResultsMessage: React.FC<NoResultsMessageProps> = ({
	hasSearched = false,
	query = "",
}) => {
	return (
		<div className='flex flex-col items-center justify-center h-full p-8 text-center bg-white rounded-md shadow-sm font-openSans'>
			{hasSearched ? (
				<>
					<h3 className='mb-4 text-xl font-semibold'>
						No results found
					</h3>
					<p className='mb-6 text-gray-600'>
						{query ? (
							<>
								We couldn't find
								any jobs
								matching "
								{query}".
							</>
						) : (
							<>
								No jobs match
								your current
								filter
								selection.
							</>
						)}
					</p>
					<div className='mt-2'>
						<p className='mb-2 font-medium text-blue-600'>
							Suggestions:
						</p>
						<ul className='space-y-1 text-left text-gray-600 list-disc list-inside'>
							<li>
								Check spelling
								or try different
								keywords
							</li>
							<li>
								Use more general
								search terms
							</li>
							<li>
								Remove some
								filters to
								broaden your
								search
							</li>
						</ul>
					</div>
				</>
			) : (
				<>
					<h3 className='mb-2 text-xl font-semibold'>
						Start your job search
					</h3>
					<p className='text-gray-600'>
						Use the search bar or filters to
						find the perfect job
						opportunity.
					</p>
				</>
			)}
		</div>
	);
};

export default NoResultsMessage;
