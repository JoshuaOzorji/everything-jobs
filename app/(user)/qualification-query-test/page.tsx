import {
	getQualifications,
	getJobsByQualification,
} from "@/sanity/lib/queries";

export default async function QualificationQueryTest() {
	try {
		// Fetch all qualifications
		const qualifications = await getQualifications();
		console.log("All Qualifications:", qualifications);

		// If there are qualifications, test fetching jobs for the first qualification
		if (qualifications.length > 0) {
			const firstQualificationSlug = qualifications[0].slug;
			console.log(
				"First Qualification Slug:",
				firstQualificationSlug,
			);

			const jobsForFirstQualification =
				await getJobsByQualification(
					firstQualificationSlug,
				);
			console.log(
				"Jobs for First Qualification:",
				jobsForFirstQualification,
			);
		}

		return (
			<div>
				<h1>Qualification Query Test</h1>
				<pre>
					{JSON.stringify(
						qualifications,
						null,
						2,
					)}
				</pre>
			</div>
		);
	} catch (error) {
		console.error("Error fetching qualifications:", error);
		return <div>Error fetching qualifications</div>;
	}
}
