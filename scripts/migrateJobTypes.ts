import { client } from "../sanity/lib/client";
import dotenv from "dotenv";

dotenv.config();

const jobTypes = [
	{ name: "Full-time", slug: "full-time" },
	{ name: "Part-time", slug: "part-time" },
	{ name: "Contract", slug: "contract" },
	{ name: "Temporary", slug: "temporary" },
	{ name: "Internship", slug: "internship" },
	{ name: "Apprenticeship", slug: "apprenticeship" },
	{ name: "Freelance", slug: "freelance" },
	{ name: "Remote", slug: "remote" },
	{ name: "Hybrid", slug: "hybrid" },
	{ name: "On-site", slug: "on-site" },
	{ name: "Volunteer", slug: "volunteer" },
	{ name: "Per Diem", slug: "per-diem" },
	{ name: "Seasonal", slug: "seasonal" },
	{ name: "Others", slug: "others" },
];

async function createJobTypes() {
	try {
		// First check if job types already exist to avoid duplicates
		const existingJobTypes = await client.fetch(
			`count(*[_type == "jobType"])`,
		);

		if (existingJobTypes > 0) {
			console.log(
				`${existingJobTypes} job types already exist. Skipping creation.`,
			);
			return;
		}

		console.log("No job types found. Creating job types...");

		const transaction = client.transaction();

		for (const jobType of jobTypes) {
			transaction.create({
				_type: "jobType",
				name: jobType.name,
				slug: {
					_type: "slug",
					current: jobType.slug,
				},
			});
		}

		const result = await transaction.commit();
		console.log(
			`Successfully created ${result.results.length} job types!`,
		);
	} catch (error) {
		console.error("Error:", error);
		process.exit(1);
	}
}

async function updateJobTypes() {
	try {
		const existingJobTypes =
			await client.fetch(`*[_type == "jobType"]{
            _id,
            name,
            slug {
                current
            }
        }`);

		const transaction = client.transaction();

		for (const jobType of jobTypes) {
			const existingJobType = existingJobTypes.find(
				(t: any) => t.slug.current === jobType.slug,
			);

			if (existingJobType) {
				if (existingJobType.name !== jobType.name) {
					transaction.patch(existingJobType._id, {
						set: {
							name: jobType.name,
							slug: {
								_type: "slug",
								current: jobType.slug,
							},
						},
					});
					console.log(
						`Updating job type: ${jobType.name}`,
					);
				}
			} else {
				transaction.create({
					_type: "jobType",
					name: jobType.name,
					slug: {
						_type: "slug",
						current: jobType.slug,
					},
				});
				console.log(
					`Creating new job type: ${jobType.name}`,
				);
			}
		}

		const result = await transaction.commit();
		console.log(
			`Successfully processed ${result.results.length} operations!`,
		);
	} catch (error) {
		console.error("Error:", error);
		process.exit(1);
	}
}

const action = process.argv[2];

if (action === "create") {
	createJobTypes();
} else if (action === "update") {
	updateJobTypes();
} else {
	console.log("Please specify an action: create or update");
	process.exit(1);
}
