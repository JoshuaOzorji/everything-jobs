import { definePlugin } from "sanity";
import type { DocumentActionComponent, DocumentActionProps } from "sanity";

interface PendingJobDocument {
	_id: string;
	title: string;
	companyName: string;
	locationName: string;
	jobTypeName: string;
	educationLevel: string;
	jobFieldName: string;
	experienceLevel: string;
	summary: any;
	salaryRange: {
		min: number;
		max: number;
	};
	experienceRange: {
		min: number;
		max: number;
	};
	requirements: string[];
	responsibilities: string[];
	recruitmentProcess: string[];
	submitterInfo: {
		name: string;
		email: string;
		phoneNumber?: string;
	};
	status: "pending" | "approved" | "rejected";
}

async function getOrCreateReference(type: string, name: string, client: any) {
	const existingDoc = await client.fetch(
		`*[_type == $type && name == $name][0]._id`,
		{ type, name },
	);

	if (existingDoc) return existingDoc;

	const newDoc = await client.create({
		_type: type,
		name: name,
	});

	return newDoc._id;
}

export const jobApprovalPlugin = definePlugin({
	name: "job-approval",
	document: {
		actions: (prev, context) => {
			if (context.schemaType !== "pendingJob") {
				return prev;
			}

			const rejectAction: DocumentActionComponent = (
				props: DocumentActionProps,
			) => ({
				label: "Reject Job",
				tone: "critical",
				onHandle: async () => {
					const client = context.getClient({
						apiVersion: "2023-01-01",
					});

					try {
						await client
							.patch(props.id)
							.set({
								status: "rejected",
								rejectedAt: new Date().toISOString(),
							})
							.commit();

						return {
							type: "success",
							message: "Job rejected successfully",
						};
					} catch (error) {
						console.error(
							"Error rejecting job:",
							error,
						);
						return {
							type: "error",
							message: "Failed to reject job",
						};
					}
				},
			});

			const approveAction: DocumentActionComponent = (
				props: DocumentActionProps,
			) => ({
				label: "Approve Job",
				tone: "positive",
				onHandle: async () => {
					const pendingJob =
						props.draft || props.published;
					if (!pendingJob)
						return { type: "error" };

					const doc =
						pendingJob as unknown as PendingJobDocument;
					const client = context.getClient({
						apiVersion: "2023-01-01",
					});

					try {
						// 1. Create references
						const companyRef =
							await getOrCreateReference(
								"company",
								doc.companyName,
								client,
							);
						const locationRef =
							await getOrCreateReference(
								"state",
								doc.locationName,
								client,
							);
						const jobTypeRef =
							await getOrCreateReference(
								"jobType",
								doc.jobTypeName,
								client,
							);
						const educationRef =
							await getOrCreateReference(
								"education",
								doc.educationLevel,
								client,
							);
						const jobFieldRef =
							await getOrCreateReference(
								"jobField",
								doc.jobFieldName,
								client,
							);
						const levelRef =
							await getOrCreateReference(
								"jobLevel",
								doc.experienceLevel,
								client,
							);

						// 2. Create published job
						await client.create({
							_type: "job",
							title: doc.title,
							company: {
								_type: "reference",
								_ref: companyRef,
							},
							location: {
								_type: "reference",
								_ref: locationRef,
							},
							jobType: {
								_type: "reference",
								_ref: jobTypeRef,
							},
							education: {
								_type: "reference",
								_ref: educationRef,
							},
							jobField: {
								_type: "reference",
								_ref: jobFieldRef,
							},
							level: {
								_type: "reference",
								_ref: levelRef,
							},
							summary: doc.summary,
							salaryRange:
								doc.salaryRange,
							experienceRange:
								doc.experienceRange,
							requirements:
								doc.requirements,
							responsibilities:
								doc.responsibilities,
							recruitmentProcess:
								doc.recruitmentProcess,
							publishedAt:
								new Date().toISOString(),
						});

						// 3. Delete the pending job document
						await client.delete(props.id);

						return {
							type: "success",
							message: "Job approved and published successfully",
						};
					} catch (error) {
						console.error(
							"Error publishing job:",
							error,
						);
						return {
							type: "error",
							message: "Failed to publish job",
						};
					}
				},
			});

			return [
				...prev.filter(
					({ action }) =>
						![
							"publish",
							"unpublish",
							"delete",
						].includes(action || ""),
				),
				approveAction,
				rejectAction,
			];
		},
	},
});
