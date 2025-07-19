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
	useCdn: false,
	token: process.env.NEXT_SANITY_API_TOKEN,
});

// import { createClient } from "next-sanity";
// import "dotenv/config";

// const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
// const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
// const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-03-23";
// const token = process.env.SANITY_API_TOKEN;

// if (!projectId) {
// 	throw new Error("The `NEXT_PUBLIC_SANITY_PROJECT_ID` environment variable is not set.");
// }
// if (!dataset) {
// 	throw new Error("The `NEXT_PUBLIC_SANITY_DATASET` environment variable is not set.");
// }
// if (!token) {
//     console.warn("The `SANITY_API_TOKEN` environment variable is not set. Data fetching will be unauthenticated.");
// }

// export const client = createClient({
// 	projectId,
// 	dataset,
// 	apiVersion,
// 	token: token,
// 	// Use a CDN in production for faster responses
// 	// Read more: https://www.sanity.io/docs/api-cdn
// 	useCdn: typeof document !== 'undefined' ? false : true,
// });
