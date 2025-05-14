"use client";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schema } from "./sanity/schemaTypes";
import { structure } from "./sanity/structure";
import { jobApprovalPlugin } from "./sanity/plugins/jobApprovalPlugin";

const config = defineConfig({
	basePath: "/studio",
	projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
	dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
	title: "Everything Jobs",
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

export default config;
