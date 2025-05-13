// import type { StructureResolver } from "sanity/structure";

// export const structure: StructureResolver = (S) =>
// 	S.list()
// 		.title("Content")
// 		.items([
// 			// Pending Jobs Section
// 			S.listItem()
// 				.title("Pending Jobs")
// 				.child(
// 					S.list()
// 						.title("Pending Jobs")
// 						.items([
// 							S.listItem()
// 								.title(
// 									"Awaiting Review",
// 								)
// 								.schemaType(
// 									"pendingJob",
// 								)
// 								.child(
// 									S.documentList()
// 										.title(
// 											"Jobs Awaiting Review",
// 										)
// 										.filter(
// 											'_type == "pendingJob" && status == "pending"',
// 										)
// 										.defaultOrdering(
// 											[
// 												{
// 													field: "submittedAt", // Changed from publishedAt to submittedAt
// 													direction: "desc",
// 												},
// 											],
// 										),
// 								),
// 							S.listItem()
// 								.title(
// 									"Rejected Jobs",
// 								)
// 								.schemaType(
// 									"pendingJob",
// 								)
// 								.child(
// 									S.documentList()
// 										.title(
// 											"Rejected Jobs",
// 										)
// 										.filter(
// 											'_type == "pendingJob" && status == "rejected"',
// 										)
// 										.defaultOrdering(
// 											[
// 												{
// 													field: "submittedAt", // Changed from publishedAt to submittedAt
// 													direction: "desc",
// 												},
// 											],
// 										),
// 								),
// 						]),
// 				),

// 			// Published Jobs
// 			S.listItem()
// 				.title("Published Jobs")
// 				.schemaType("job")
// 				.child(
// 					S.documentList()
// 						.title("Published Jobs")
// 						.filter('_type == "job"')
// 						.defaultOrdering([
// 							{
// 								field: "publishedAt",
// 								direction: "desc",
// 							},
// 						]),
// 				),

// 			// Other document types
// 			...S.documentTypeListItems().filter(
// 				(listItem) =>
// 					!["job", "pendingJob"].includes(
// 						listItem.getId() || "",
// 					),
// 			),
// 		]);

import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
	S.list()
		.title("Content")
		.items([
			// Regular document types
			...S.documentTypeListItems().filter(
				(item) =>
					!["pendingJob", "job"].includes(
						item.getId() || "",
					),
			),

			// Pending Jobs with custom view
			S.listItem()
				.title("Pending Jobs")
				.schemaType("pendingJob")
				.child(
					S.documentList()
						.title("Pending Jobs")
						.filter('_type == "pendingJob"')
						.defaultOrdering([
							{
								field: "submittedAt",
								direction: "desc",
							},
						]),
				),

			// Published Jobs
			S.listItem()
				.title("Published Jobs")
				.schemaType("job")
				.child(
					S.documentList()
						.title("Published Jobs")
						.filter('_type == "job"')
						.defaultOrdering([
							{
								field: "publishedAt",
								direction: "desc",
							},
						]),
				),
		]);
