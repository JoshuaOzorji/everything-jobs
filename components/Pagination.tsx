"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export interface PaginationProps {
	currentPage: number;
	total: number;
	perPage: number;
}

export default function Pagination({
	currentPage,
	total,
	perPage,
}: PaginationProps) {
	const searchParams = useSearchParams();
	const totalPages = Math.ceil(total / perPage);

	// Helper function to build URL with preserved search params
	const buildPageUrl = (pageNumber: number) => {
		const params = new URLSearchParams(searchParams.toString());

		if (pageNumber === 1) {
			params.delete("page");
		} else {
			params.set("page", pageNumber.toString());
		}

		const queryString = params.toString();
		return `/search${queryString ? `?${queryString}` : ""}`;
	};

	// Generate page numbers to show
	const getPageNumbers = () => {
		const pageNumbers = [];
		const maxPagesToShow = 5;

		if (totalPages <= maxPagesToShow) {
			// If there are few pages, show all of them
			for (let i = 1; i <= totalPages; i++) {
				pageNumbers.push(i);
			}
		} else {
			// Always include first page
			pageNumbers.push(1);

			// Calculate start and end of visible pages
			let start = Math.max(2, currentPage - 1);
			let end = Math.min(totalPages - 1, currentPage + 1);

			// Adjust if we're near the start or end
			if (currentPage <= 2) {
				end = 4;
			} else if (currentPage >= totalPages - 1) {
				start = totalPages - 3;
			}

			// Add ellipsis if needed
			if (start > 2) {
				pageNumbers.push("...");
			}

			// Add middle pages
			for (let i = start; i <= end; i++) {
				pageNumbers.push(i);
			}

			// Add ellipsis if needed
			if (end < totalPages - 1) {
				pageNumbers.push("...");
			}

			// Always include last page
			pageNumbers.push(totalPages);
		}

		return pageNumbers;
	};

	const pageNumbers = getPageNumbers();

	return (
		<div className='flex justify-center items-center my-8 gap-1 font-saira text-sm'>
			{/* Previous button */}
			{currentPage > 1 && (
				<Link
					href={buildPageUrl(currentPage - 1)}
					className='px-2 py-1 border rounded hover:bg-gray-100'>
					Prev
				</Link>
			)}

			{/* Page numbers */}
			{pageNumbers.map((page, index) => (
				<div key={index}>
					{page === "..." ? (
						<span className='px-3 py-1'>
							...
						</span>
					) : (
						<Link
							href={buildPageUrl(
								page as number,
							)}
							className={`px-2 py-1 border rounded ${
								currentPage ===
								page
									? "bg-pry2 text-white"
									: "hover:bg-gray-100"
							}`}>
							{page}
						</Link>
					)}
				</div>
			))}

			{/* Next button */}
			{currentPage < totalPages && (
				<Link
					href={buildPageUrl(currentPage + 1)}
					className='px-2 py-1 border rounded hover:bg-gray-100'>
					Next
				</Link>
			)}
		</div>
	);
}
