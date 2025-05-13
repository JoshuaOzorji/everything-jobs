import { type SchemaTypeDefinition } from "sanity";

import { blockContentType } from "./blockContentType";
import { jobSchema } from "./jobSchema";
import { jobTypeSchema } from "./jobTypeSchema";
import { stateSchema } from "./stateSchema";
import { educationSchema } from "./educationSchema";
import { companySchema } from "./companySchema";
import { jobFieldSchema } from "./jobFieldsSchema";
import { jobLevelSchema } from "./jobLevelSchema";
import { industrySchema } from "./industrySchema";
import { citySchema } from "./citySchema";
import { pendingJobSchema } from "./pendingJobSchema";

export const schema: { types: SchemaTypeDefinition[] } = {
	types: [
		blockContentType,
		companySchema,
		jobFieldSchema,
		jobSchema,
		jobTypeSchema,
		jobLevelSchema,
		stateSchema,
		educationSchema,
		industrySchema,
		citySchema,
		pendingJobSchema,
	],
};
