import { type SchemaTypeDefinition } from "sanity";

import { blockContentType } from "./blockContentType";
import { jobSchema } from "./jobSchema";
import { jobTypeSchema } from "./jobTypeSchema";
import { locationSchema } from "./locationSchema";
import { qualificationSchema } from "./qualificationSchema";
import { companySchema } from "./companySchema";

export const schema: { types: SchemaTypeDefinition[] } = {
	types: [
		blockContentType,
		companySchema,
		jobSchema,
		jobTypeSchema,
		locationSchema,
		qualificationSchema,
	],
};
