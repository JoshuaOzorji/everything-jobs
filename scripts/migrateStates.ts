import { client } from "../sanity/lib/client";
import dotenv from "dotenv";

dotenv.config();

const nigerianStates = [
	{ name: "Remote", slug: "remote" },
	{ name: "Abia", slug: "abia" },
	{ name: "Adamawa", slug: "adamawa" },
	{ name: "Akwa Ibom", slug: "akwa-ibom" },
	{ name: "Anambra", slug: "anambra" },
	{ name: "Bauchi", slug: "bauchi" },
	{ name: "Bayelsa", slug: "bayelsa" },
	{ name: "Benue", slug: "benue" },
	{ name: "Borno", slug: "borno" },
	{ name: "Cross River", slug: "cross-river" },
	{ name: "Delta", slug: "delta" },
	{ name: "Ebonyi", slug: "ebonyi" },
	{ name: "Edo", slug: "edo" },
	{ name: "Ekiti", slug: "ekiti" },
	{ name: "Enugu", slug: "enugu" },
	{ name: "Federal Capital Territory", slug: "abuja" }, // Changed from "Abuja" // FCT
	{ name: "Gombe", slug: "gombe" },
	{ name: "Imo", slug: "imo" },
	{ name: "Jigawa", slug: "jigawa" },
	{ name: "Kaduna", slug: "kaduna" },
	{ name: "Kano", slug: "kano" },
	{ name: "Katsina", slug: "katsina" },
	{ name: "Kebbi", slug: "kebbi" },
	{ name: "Kogi", slug: "kogi" },
	{ name: "Kwara", slug: "kwara" },
	{ name: "Lagos", slug: "lagos" },
	{ name: "Nasarawa", slug: "nasarawa" },
	{ name: "Niger", slug: "niger" },
	{ name: "Ogun", slug: "ogun" },
	{ name: "Ondo", slug: "ondo" },
	{ name: "Osun", slug: "osun" },
	{ name: "Oyo", slug: "oyo" },
	{ name: "Plateau", slug: "plateau" },
	{ name: "Rivers", slug: "rivers" },
	{ name: "Sokoto", slug: "sokoto" },
	{ name: "Taraba", slug: "taraba" },
	{ name: "Yobe", slug: "yobe" },
	{ name: "Zamfara", slug: "zamfara" },
];

async function createStates() {
	try {
		// First check if states already exist to avoid duplicates
		const existingStates = await client.fetch(
			`count(*[_type == "state"])`,
		);

		if (existingStates > 0) {
			console.log(
				`${existingStates} states already exist. Skipping migration.`,
			);
			return;
		}

		console.log("No states found. Creating states...");

		// Create a transaction for better performance
		const transaction = client.transaction();

		for (const state of nigerianStates) {
			transaction.create({
				_type: "state",
				name: state.name,
				slug: {
					_type: "slug",
					current: state.slug,
				},
			});
		}

		const result = await transaction.commit();
		console.log(
			`Successfully created ${result.results.length} states!`,
		);
	} catch (error) {
		console.error("Error:", error);
		process.exit(1);
	}
}

// Execute the function
createStates();

async function updateStates() {
	try {
		// Get all existing states
		const existingStates = await client.fetch(`*[_type == "state"]{
      _id,
      name,
      slug {
        current
      }
    }`);

		const transaction = client.transaction();

		// Update existing states or add new ones
		for (const state of nigerianStates) {
			const existingState = existingStates.find(
				(s: any) => s.slug.current === state.slug,
			);

			if (existingState) {
				// Update existing state if name has changed
				if (existingState.name !== state.name) {
					transaction.patch(existingState._id, {
						set: {
							name: state.name,
							slug: {
								_type: "slug",
								current: state.slug,
							},
						},
					});
					console.log(
						`Updating state: ${state.name}`,
					);
				}
			} else {
				// Create new state
				transaction.create({
					_type: "state",
					name: state.name,
					slug: {
						_type: "slug",
						current: state.slug,
					},
				});
				console.log(
					`Creating new state: ${state.name}`,
				);
			}
		}

		// Check for states to delete (states in DB but not in nigerianStates)
		const statesToDelete = existingStates.filter(
			(existingState: any) =>
				!nigerianStates.some(
					(s) =>
						s.slug ===
						existingState.slug.current,
				),
		);

		statesToDelete.forEach((state: any) => {
			transaction.delete(state._id);
			console.log(`Deleting state: ${state.name}`);
		});

		const result = await transaction.commit();
		console.log(
			`Successfully processed ${result.results.length} operations!`,
		);
	} catch (error) {
		console.error("Error:", error);
		process.exit(1);
	}
}

// Replace createStates() call with updateStates()
updateStates();

const action = process.argv[2];

if (action === "create") {
	createStates();
} else if (action === "update") {
	updateStates();
} else {
	console.log("Please specify an action: create or update");
	process.exit(1);
}
