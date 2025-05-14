import { definePlugin } from "sanity";
import type {
	DocumentActionComponent,
	DocumentActionProps,
	SanityDocument,
} from "sanity";
import { client } from "../lib/client";

interface PendingJobDocument extends SanityDocument {
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
	requirements: any[];
	responsibilities: any[];
	recruitmentProcess: any[];
	submitterInfo: {
		name: string;
		email: string;
		phoneNumber?: string;
	};
	status: "pending" | "approved" | "rejected";
}

// Helper function to get or create company reference
async function getOrCreateCompany(companyName: string) {
	const existingCompany = await client.fetch(
		`*[_type == "company" && name == $name][0]._id`,
		{ name: companyName },
	);

	if (existingCompany) return existingCompany;

	const newCompany = await client.create({
		_type: "company",
		name: companyName,
	});

	return newCompany._id;
}

// Helper function to get or create references for other document types
async function getOrCreateReference(type: string, name: string) {
	const existing = await client.fetch(
		`*[_type == $type && name == $name][0]._id`,
		{ type, name },
	);

	if (existing) return existing;

	const newRef = await client.create({
		_type: type,
		name: name,
	});

	return newRef._id;
}

export const jobApprovalPlugin = definePlugin({
	name: "job-approval",
	document: {
		actions: (prev, context) => {
			if (context.schemaType !== "pendingJob") {
				return prev;
			}

			const approveAction: DocumentActionComponent = (
				props: DocumentActionProps,
			) => {
				return {
					label: "Approve Job",
					type: "action",
					color: "success",
					onHandle: async () => {
						const pendingDoc =
							props.draft ||
							props.published;
						if (!pendingDoc)
							return {
								type: "error",
								message: "No document found",
							};

						const doc =
							pendingDoc as unknown as PendingJobDocument;

						try {
							// Create job with proper references
							await client.create({
								_type: "job",
								title: doc.title,
								company: {
									_type: "reference",
									_ref: await getOrCreateCompany(
										doc.companyName,
									),
								},
								location: {
									_type: "reference",
									_ref: await getOrCreateReference(
										"state",
										doc.locationName,
									),
								},
								jobType: {
									_type: "reference",
									_ref: await getOrCreateReference(
										"jobType",
										doc.jobTypeName,
									),
								},
								education: {
									_type: "reference",
									_ref: await getOrCreateReference(
										"education",
										doc.educationLevel,
									),
								},
								jobField: {
									_type: "reference",
									_ref: await getOrCreateReference(
										"jobField",
										doc.jobFieldName,
									),
								},
								level: {
									_type: "reference",
									_ref: await getOrCreateReference(
										"jobLevel",
										doc.experienceLevel,
									),
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

							// Update pending job status
							await client
								.patch(doc._id)
								.set({
									status: "approved",
								})
								.commit();

							return {
								type: "success",
							};
						} catch (error) {
							console.error(
								"Error approving job:",
								error,
							);
							return {
								type: "error",
								message: "Failed to approve job",
							};
						}
					},
				};
			};

			const rejectAction: DocumentActionComponent = (
				props: DocumentActionProps,
			) => {
				return {
					label: "Reject Job",
					type: "action",
					color: "danger",
					onHandle: async () => {
						const pendingDoc =
							props.draft ||
							props.published;
						if (!pendingDoc)
							return {
								type: "error",
								message: "No document found",
							};

						const doc =
							pendingDoc as unknown as PendingJobDocument;

						try {
							await client
								.patch(doc._id)
								.set({
									status: "rejected",
								})
								.commit();

							return {
								type: "success",
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
				};
			};

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
