// import { createClient } from "next-sanity";

// export const client = createClient({
// 	projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
// 	dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
// 	apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
// 	useCdn: false,
// 	token: process.env.SANITY_API_TOKEN,
// });

import { createClient } from "next-sanity";
import "dotenv/config";

// const cache = new Map();

if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
	throw new Error("NEXT_PUBLIC_SANITY_PROJECT_ID is not set");
}

export const client = createClient({
	projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
	dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
	apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-03-23",
	useCdn: true,
	token: process.env.SANITY_API_TOKEN,
});

// interface QueryParams {
// 	[key: string]: any;
// }

// export const cachedFetch = async (
// 	query: string,
// 	params: QueryParams = {},
// ): Promise<any> => {
// 	const cacheKey: string = JSON.stringify({ query, params });

// 	if (cache.has(cacheKey)) {
// 		return cache.get(cacheKey);
// 	}

// 	const result: any = await client.fetch(query, params);
// 	cache.set(cacheKey, result);
// 	return result;
// };
