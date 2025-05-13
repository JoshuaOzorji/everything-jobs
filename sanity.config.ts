import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schema } from "./sanity/schemaTypes";
import { structure } from "./sanity/structure";
import { jobApprovalPlugin } from "./sanity/plugins/jobApprovalPlugin";

export default defineConfig({
	basePath: "/studio",
	projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
	dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
	schema,
	plugins: [
		structureTool({
			structure,
			defaultDocumentNode: (S) =>
				S.document().views([S.view.form()]),
		}),
		jobApprovalPlugin(),
		visionTool(),
	],
	document: {
		// Prevent the creation of new documents directly from the studio
		newDocumentOptions: (prev, { creationContext }) => {
			if (creationContext.type === "global") {
				return prev.filter(
					(template) =>
						template.templateId !==
						"pendingJob",
				);
			}
			return prev;
		},
		// Prevent document duplication
		actions: (prev, { schemaType }) => {
			if (schemaType === "pendingJob") {
				return prev.filter(
					({ action }) =>
						!["duplicate"].includes(
							action || "",
						),
				);
			}
			return prev;
		},
	},
});
