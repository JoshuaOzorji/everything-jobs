// import { definePlugin } from "sanity";
// import type { DocumentActionComponent, DocumentActionProps } from "sanity";

// export const jobApprovalPlugin = definePlugin({
// 	name: "job-approval",
// 	document: {
// 		actions: (prev, context) => {
// 			if (context.schemaType !== "pendingJob") {
// 				return prev;
// 			}

// 			const approveAction: DocumentActionComponent = (
// 				props: DocumentActionProps,
// 			) => ({
// 				label: "Approve Job",
// 				type: "action",
// 				color: "success",
// 				onHandle: async () => {
// 					const { draft, published, client } =
// 						props;
// 					const doc = draft || published;

// 					if (!doc) return;

// 					try {
// 						// Create approved job
// 						await client.create({
// 							_type: "job",
// 							title: doc.title,
// 							companyName:
// 								doc.companyName,
// 							locationName:
// 								doc.locationName,
// 							jobTypeName:
// 								doc.jobTypeName,
// 							educationLevel:
// 								doc.educationLevel,
// 							jobFieldName:
// 								doc.jobFieldName,
// 							experienceLevel:
// 								doc.experienceLevel,
// 							summary: doc.summary,
// 							salaryRange:
// 								doc.salaryRange,
// 							experienceRange:
// 								doc.experienceRange,
// 							requirements:
// 								doc.requirements,
// 							responsibilities:
// 								doc.responsibilities,
// 							recruitmentProcess:
// 								doc.recruitmentProcess,
// 							submitterInfo:
// 								doc.submitterInfo,
// 							publishedAt:
// 								new Date().toISOString(),
// 						});

// 						// Update pending job status
// 						await client
// 							.patch(doc._id)
// 							.set({
// 								status: "approved",
// 							})
// 							.commit();

// 						props.onComplete();
// 					} catch (error) {
// 						console.error(
// 							"Error approving job:",
// 							error,
// 						);
// 						props.onError();
// 					}
// 				},
// 			});

// 			const rejectAction: DocumentActionComponent = (
// 				props: DocumentActionProps,
// 			) => ({
// 				label: "Reject Job",
// 				type: "action",
// 				color: "danger",
// 				onHandle: async () => {
// 					const { draft, published, client } =
// 						props;
// 					const doc = draft || published;

// 					if (!doc) return;

// 					try {
// 						await client
// 							.patch(doc._id)
// 							.set({
// 								status: "rejected",
// 							})
// 							.commit();

// 						props.onComplete();
// 					} catch (error) {
// 						console.error(
// 							"Error rejecting job:",
// 							error,
// 						);
// 						props.onError();
// 					}
// 				},
// 			});

// 			return [
// 				...prev.filter(
// 					({ action }) =>
// 						![
// 							"publish",
// 							"unpublish",
// 							"delete",
// 						].includes(action || ""),
// 				),
// 				approveAction,
// 				rejectAction,
// 			];
// 		},
// 	},
// });
import { definePlugin } from "sanity";
import type {
	DocumentActionComponent,
	DocumentActionProps,
	SanityDocument,
} from "sanity";
import { client } from "../lib/client";

// Define a more specific type that extends SanityDocument
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
				// Using the imported client instead of props.getClient
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

						// Use type assertion carefully with unknown first
						const doc =
							pendingDoc as unknown as PendingJobDocument;

						try {
							await client.create({
								_type: "job",
								title: doc.title,
								companyName:
									doc.companyName,
								locationName:
									doc.locationName,
								jobTypeName:
									doc.jobTypeName,
								educationLevel:
									doc.educationLevel,
								jobFieldName:
									doc.jobFieldName,
								experienceLevel:
									doc.experienceLevel,
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
								submitterInfo:
									doc.submitterInfo,
								publishedAt:
									new Date().toISOString(),
							});

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
				// Using the imported client instead of props.getClient
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

						// Use type assertion carefully
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
