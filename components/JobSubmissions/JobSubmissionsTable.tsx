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

const statusColors = {
	pending: "bg-yellow-100 text-yellow-800",
	approved: "bg-green-100 text-green-800",
	rejected: "bg-red-100 text-red-800",
};

export default function JobSubmissionsTable() {
	const searchParams = useSearchParams();
	const [submissions, setSubmissions] = useState<JobSubmissionItem[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetchSubmissions() {
			try {
				const response = await fetch(
					`/api/view-jobs?${searchParams.toString()}`,
				);
				if (!response.ok)
					throw new Error(
						"Failed to fetch submissions",
					);
				const data = await response.json();
				setSubmissions(data.submissions);
			} catch (error) {
				toast.error("Failed to load job submissions");
			} finally {
				setLoading(false);
			}
		}

		fetchSubmissions();
	}, [searchParams]);

	if (loading) return <div>Loading...</div>;

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Job Title</TableHead>
					<TableHead>Company</TableHead>
					<TableHead>Submitted Date</TableHead>
					<TableHead>Status</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{submissions.length === 0 ? (
					<TableRow>
						<TableCell
							colSpan={4}
							className='text-center'>
							No submissions found
						</TableCell>
					</TableRow>
				) : (
					submissions.map((submission) => (
						<TableRow key={submission._id}>
							<TableCell>
								{
									submission.title
								}
							</TableCell>
							<TableCell>
								{
									submission.companyName
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
					))
				)}
			</TableBody>
		</Table>
	);
}
