import { client } from "../sanity/lib/client";
import dotenv from "dotenv";

dotenv.config();

const jobLevels = [
	{ name: "Entry Level", slug: "entry-level" },
	{ name: "Mid Level", slug: "mid-level" },
	{ name: "Senior Level", slug: "senior-level" },
	{ name: "Lead", slug: "lead" },
	{ name: "Manager", slug: "manager" },
	{ name: "Director", slug: "director" },
	{ name: "Executive", slug: "executive" },
];

async function createJobLevels() {
	try {
		const existingLevels = await client.fetch(
			`count(*[_type == "jobLevel"])`,
		);

		if (existingLevels > 0) {
			console.log(
				`${existingLevels} job levels already exist. Skipping creation.`,
			);
			return;
		}

		console.log("No job levels found. Creating job levels...");

		const transaction = client.transaction();

		for (const level of jobLevels) {
			transaction.create({
				_type: "jobLevel",
				name: level.name,
				slug: {
					_type: "slug",
					current: level.slug,
				},
			});
		}

		const result = await transaction.commit();
		console.log(
			`Successfully created ${result.results.length} job levels!`,
		);
	} catch (error) {
		console.error("Error:", error);
		process.exit(1);
	}
}

async function updateJobLevels() {
	try {
		const existingLevels =
			await client.fetch(`*[_type == "jobLevel"]{
            _id,
            name,
            slug {
                current
            }
        }`);

		const transaction = client.transaction();

		for (const level of jobLevels) {
			const existingLevel = existingLevels.find(
				(l: any) => l.slug.current === level.slug,
			);

			if (existingLevel) {
				if (existingLevel.name !== level.name) {
					transaction.patch(existingLevel._id, {
						set: {
							name: level.name,
							slug: {
								_type: "slug",
								current: level.slug,
							},
						},
					});
					console.log(
						`Updating job level: ${level.name}`,
					);
				}
			} else {
				transaction.create({
					_type: "jobLevel",
					name: level.name,
					slug: {
						_type: "slug",
						current: level.slug,
					},
				});
				console.log(
					`Creating new job level: ${level.name}`,
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
	createJobLevels();
} else if (action === "update") {
	updateJobLevels();
} else {
	console.log("Please specify an action: create or update");
	process.exit(1);
}
