import { client } from "../sanity/lib/client";
import dotenv from "dotenv";

dotenv.config();

const educationLevels = [
	{ name: "SSCE", slug: "ssce" },
	{ name: "NCE", slug: "nce" },
	{ name: "ND", slug: "nd" },
	{ name: "BSC/BA/HND", slug: "bsc-ba-hnd" },
	{ name: "MSC/MA/MBA", slug: "masters" },
	{ name: "PhD/Fellowship", slug: "phd" },
	{ name: "Others", slug: "others" },
];

async function createEducationLevels() {
	try {
		const existingLevels = await client.fetch(
			`count(*[_type == "education"])`,
		);

		if (existingLevels > 0) {
			console.log(
				`${existingLevels} education levels already exist. Skipping creation.`,
			);
			return;
		}

		console.log(
			"No education levels found. Creating education levels...",
		);

		const transaction = client.transaction();

		for (const level of educationLevels) {
			transaction.create({
				_type: "education",
				name: level.name,
				slug: {
					_type: "slug",
					current: level.slug,
				},
			});
		}

		const result = await transaction.commit();
		console.log(
			`Successfully created ${result.results.length} education levels!`,
		);
	} catch (error) {
		console.error("Error:", error);
		process.exit(1);
	}
}

async function updateEducationLevels() {
	try {
		const existingLevels =
			await client.fetch(`*[_type == "education"]{
            _id,
            name,
            slug {
                current
            }
        }`);

		const transaction = client.transaction();

		for (const level of educationLevels) {
			const existingLevel = existingLevels.find(
				(e: any) => e.slug.current === level.slug,
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
						`Updating education level: ${level.name}`,
					);
				}
			} else {
				transaction.create({
					_type: "education",
					name: level.name,
					slug: {
						_type: "slug",
						current: level.slug,
					},
				});
				console.log(
					`Creating new education level: ${level.name}`,
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
	createEducationLevels();
} else if (action === "update") {
	updateEducationLevels();
} else {
	console.log("Please specify an action: create or update");
	process.exit(1);
}
