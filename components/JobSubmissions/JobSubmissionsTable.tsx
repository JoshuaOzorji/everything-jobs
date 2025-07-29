"use client";

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
import Pagination from "@/components/Pagination";
import { useJobSubmissions } from "@/hooks/useJobSubmissions";
import { useEffect } from "react";

const statusColors = {
	pending: "bg-yellow-100 text-yellow-800",
	approved: "bg-green-100 text-green-800",
	rejected: "bg-red-100 text-red-800",
};

export default function JobSubmissionsTable() {
	const { submissions, total, currentPage, isLoading, isError } =
		useJobSubmissions();

	const perPage = 10;

	// Show error toast when query fails
	useEffect(() => {
		if (isError) {
			toast.error("Failed to load job submissions");
		}
	}, [isError]);

	if (isLoading) return <LoadingComponent />;

	return (
		<div className='space-y-4 font-saira'>
			<div className='border rounded-md'>
				<Table>
					<TableHeader className='bg-white '>
						<TableRow>
							<TableHead className='px-2 text-xs text-black md:text-sm'>
								Job Title
							</TableHead>
							<TableHead className='px-2 text-xs text-black md:text-sm'>
								Submitted Date
							</TableHead>
							<TableHead className='px-2 text-xs text-black md:text-sm'>
								Status
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{submissions.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={
										3
									}
									className='py-8 text-center'>
									No job
									submissions
									found
								</TableCell>
							</TableRow>
						) : (
							submissions.map(
								(
									submission: JobSubmissionItem,
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
