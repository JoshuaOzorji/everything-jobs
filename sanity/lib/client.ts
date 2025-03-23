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

if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
	throw new Error("NEXT_PUBLIC_SANITY_PROJECT_ID is not set");
}

export const client = createClient({
	projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
	dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
	apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-03-23",
	useCdn: false,
	token: process.env.SANITY_API_TOKEN,
});
