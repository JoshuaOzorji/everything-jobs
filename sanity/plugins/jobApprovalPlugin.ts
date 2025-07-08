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
			// Handle published jobs (job documents) - keep only specific actions
			if (context.schemaType === "job") {
				return prev.filter(({ action }) =>
					[
						"discardChanges",
						"publish",
						"unpublish",
						"duplicate",
					].includes(action || ""),
				);
			}

			// Handle pending jobs
			if (context.schemaType === "pendingJob") {
				// We need to check the document status within each action
				// since we don't have access to the document in the context

				const restoreAction: DocumentActionComponent = (
					props: DocumentActionProps,
				) => {
					const doc =
						props.draft || props.published;

					// Only show restore action for rejected jobs
					if (doc?.status !== "rejected") {
						return null;
					}

					return {
						label: "Restore to Pending",
						tone: "positive",
						onHandle: async () => {
							const client =
								context.getClient(
									{
										apiVersion: "2023-01-01",
									},
								);

							try {
								await client
									.patch(
										props.id,
									)
									.set({
										status: "pending",
									})
									.unset([
										"rejectedAt",
									])
									.commit();

								return {
									type: "success",
									message: "Job restored to pending successfully",
								};
							} catch (error) {
								console.error(
									"Error restoring job:",
									error,
								);
								return {
									type: "error",
									message: `Failed to restore job: ${typeof error === "object" && error !== null && "message" in error ? (error as any).message : "Unknown error"}`,
								};
							}
						},
					};
				};

				const deleteAction: DocumentActionComponent = (
					props: DocumentActionProps,
				) => {
					const doc =
						props.draft || props.published;

					// Only show delete action for rejected jobs
					if (doc?.status !== "rejected") {
						return null;
					}

					return {
						label: "Delete",
						tone: "critical",
						onHandle: async () => {
							const client =
								context.getClient(
									{
										apiVersion: "2023-01-01",
									},
								);

							try {
								await client.delete(
									props.id,
								);
								return {
									type: "success",
									message: "Job deleted successfully",
								};
							} catch (error) {
								console.error(
									"Error deleting job:",
									error,
								);
								return {
									type: "error",
									message: `Failed to delete job: ${typeof error === "object" && error !== null && "message" in error ? (error as any).message : "Unknown error"}`,
								};
							}
						},
					};
				};

				const rejectAction: DocumentActionComponent = (
					props: DocumentActionProps,
				) => {
					const doc =
						props.draft || props.published;

					// Only show reject action for pending jobs
					if (
						doc?.status !== "pending" &&
						doc?.status !== undefined
					) {
						return null;
					}

					return {
						label: "Reject Job",
						tone: "critical",
						onHandle: async () => {
							const client =
								context.getClient(
									{
										apiVersion: "2023-01-01",
									},
								);

							try {
								const doc =
									props.draft ||
									props.published;
								if (!doc) {
									return {
										type: "error",
										message: "No job document found to reject",
									};
								}

								await client
									.patch(
										props.id,
									)
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
									message: `Failed to reject job: ${typeof error === "object" && error !== null && "message" in error ? (error as any).message : "Unknown error"}`,
								};
							}
						},
					};
				};

				const approveAction: DocumentActionComponent = (
					props: DocumentActionProps,
				) => {
					const doc =
						props.draft || props.published;

					// Only show approve action for pending jobs
					if (
						doc?.status !== "pending" &&
						doc?.status !== undefined
					) {
						return null;
					}

					return {
						label: "Approve Job",
						tone: "positive",
						onHandle: async () => {
							const pendingJob =
								props.draft ||
								props.published;
							if (!pendingJob) {
								return {
									type: "error",
									message: "No job document found",
								};
							}

							const doc =
								pendingJob as unknown as PendingJobDocument;
							const client =
								context.getClient(
									{
										apiVersion: "2023-01-01",
									},
								);

							try {
								// Validate required fields
								if (
									!doc.title ||
									!doc.companyName ||
									!doc.locationName
								) {
									return {
										type: "error",
										message: "Missing required fields (title, company, or location)",
									};
								}

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
										doc.jobTypeName ||
											"Full-time",
										client,
									);
								const educationRef =
									await getOrCreateReference(
										"education",
										doc.educationLevel ||
											"Bachelor's",
										client,
									);
								const jobFieldRef =
									await getOrCreateReference(
										"jobField",
										doc.jobFieldName ||
											"General",
										client,
									);
								const levelRef =
									await getOrCreateReference(
										"jobLevel",
										doc.experienceLevel ||
											"Entry Level",
										client,
									);

								// 2. Create published job with safe property access
								await client.create(
									{
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
										summary:
											doc.summary ||
											null,
										salaryRange:
											doc.salaryRange || {
												min: 0,
												max: 0,
											},
										experienceRange:
											doc.experienceRange || {
												min: 0,
												max: 0,
											},
										requirements:
											Array.isArray(
												doc.requirements,
											)
												? doc.requirements
												: [],
										responsibilities:
											Array.isArray(
												doc.responsibilities,
											)
												? doc.responsibilities
												: [],
										recruitmentProcess:
											Array.isArray(
												doc.recruitmentProcess,
											)
												? doc.recruitmentProcess
												: [],
										publishedAt:
											new Date().toISOString(),
									},
								);

								// 3. Update status to approved
								await client
									.patch(
										props.id,
									)
									.set({
										status: "approved",
										approvedAt: new Date().toISOString(),
									})
									.commit();

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
									message: `Failed to publish job: ${typeof error === "object" && error !== null && "message" in error ? (error as any).message : "Unknown error"}`,
								};
							}
						},
					};
				};

				return [
					approveAction,
					rejectAction,
					restoreAction,
					deleteAction,
				].filter(Boolean);
			}

			return prev;
		},
	},
});
