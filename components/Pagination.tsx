import React from "react";
import Link from "next/link";

interface PaginationProps {
	total: number;
	itemsPerPage?: number;
	currentPage?: number;
	basePath?: string;
}

export default function Pagination({
	total,
	itemsPerPage = 10,
	currentPage = 1,
	basePath = "",
}: PaginationProps) {
	const totalPages = Math.ceil(total / itemsPerPage);

	// Generate an array of page numbers
	const pageNumbers = Array.from(
		{ length: totalPages },
		(_, index) => index + 1,
	);

	return (
		<div className='flex justify-center items-center space-x-2 mt-8'>
			{/* Previous Button */}
			{currentPage > 1 && (
				<Link
					href={`${basePath}?page=${currentPage - 1}`}
					className='px-4 py-2 border rounded hover:bg-gray-100'>
					Previous
				</Link>
			)}

			{/* Page Numbers */}
			{pageNumbers.map((page) => (
				<Link
					key={page}
					href={`${basePath}?page=${page}`}
					className={`px-4 py-2 border rounded ${
						currentPage === page
							? "bg-blue-500 text-white"
							: "hover:bg-gray-100"
					}`}>
					{page}
				</Link>
			))}

			{/* Next Button */}
			{currentPage < totalPages && (
				<Link
					href={`${basePath}?page=${currentPage + 1}`}
					className='px-4 py-2 border rounded hover:bg-gray-100'>
					Next
				</Link>
			)}
		</div>
	);
}
