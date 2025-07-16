"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/formatDate";
import type { JobSubmissionItem } from "@/types/types";
import { toast } from "sonner";
import { LoadingComponent } from "@/components/Loading";
import Pagination from "@/components/PaginationComponent";

const statusColors = {
	pending: "bg-yellow-100 text-yellow-800",
	approved: "bg-green-100 text-green-800",
	rejected: "bg-red-100 text-red-800",
};

export default function JobSubmissionsTable() {
	const searchParams = useSearchParams();
	const [submissions, setSubmissions] = useState<JobSubmissionItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [total, setTotal] = useState(0);
	const [currentPage, setCurrentPage] = useState(1);
	const perPage = 10;

	useEffect(() => {
		async function fetchSubmissions() {
			try {
				setLoading(true);
				const response = await fetch(
					`/api/view-jobs?${searchParams.toString()}`,
				);
				if (!response.ok)
					throw new Error(
						"Failed to fetch submissions",
					);
				const data = await response.json();
				setSubmissions(data.submissions);
				setTotal(data.total);
				setCurrentPage(
					parseInt(
						searchParams.get("page") || "1",
					),
				);
			} catch (error) {
				toast.error("Failed to load job submissions");
			} finally {
				setLoading(false);
			}
		}

		fetchSubmissions();
	}, [searchParams]);

	if (loading) return <LoadingComponent />;

	return (
		<div className='space-y-4 font-openSans'>
			<div className='rounded-md border'>
				<Table>
					<TableHeader className='bg-white '>
						<TableRow>
							<TableHead className='text-black px-2 text-xs md:text-sm'>
								Job Title
							</TableHead>

							<TableHead className='text-black px-2 text-xs md:text-sm'>
								Submitted Date
							</TableHead>

							<TableHead className='text-black px-2 text-xs md:text-sm'>
								Status
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{submissions.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={
										6
									}
									className='text-center py-8'>
									No job
									submissions
									found
								</TableCell>
							</TableRow>
						) : (
							submissions.map(
								(
									submission,
								) => (
									<TableRow
										key={
											submission._id
										}>
										<TableCell className='font-medium'>
											{
												submission.title
											}
										</TableCell>

										<TableCell>
											{formatDate(
												new Date(
													submission.submittedAt,
												),
											)}
										</TableCell>
										<TableCell>
											<Badge
												className={
													statusColors[
														submission
															.status
													]
												}>
												{
													submission.status
												}
											</Badge>
										</TableCell>
									</TableRow>
								),
							)
						)}
					</TableBody>
				</Table>
			</div>

			{submissions.length > 0 && (
				<Pagination
					currentPage={currentPage}
					total={total}
					perPage={perPage}
				/>
			)}
		</div>
	);
}
