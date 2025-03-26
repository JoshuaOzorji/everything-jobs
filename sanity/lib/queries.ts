import { groq } from "next-sanity";
import { client } from "./client";

export const searchJobsQuery = groq`
  *[_type == "job" && 
    (title match $q + "*" || company->name match $q + "*") &&
    // ($location == "" || location->states[] match $location) &&
    ($location == "" || location->name match $location) &&
    ($jobType == "" || jobType->name == $jobType) &&
    ($jobLevel == "" || level->name == $jobLevel) &&
    ($qualification == "" || qualification->name == $qualification) &&
    ($jobField == "" || jobField->name == $jobField)
  ] {
    _id,
    title,
    "slug": slug.current,
    "company": company->name,
    "companyLogo": company->logo.asset->url,
    "location": location->name,
    "jobType": jobType->name,
    "level": level->name,
    "qualification": qualification->name,
    "jobField": jobField->name,
    salaryRange,
    publishedAt,
    deadline
  } | order(publishedAt desc)[0...50]
`;

export const getFiltersQuery = groq`{
  "jobTypes": *[_type == "jobType"] { _id, name },
  "jobLevels": *[_type == "jobLevel"] { _id, name },
  "qualifications": *[_type == "qualification"] { _id, name },
  "jobFields": *[_type == "jobField"] { _id, name }
}`;

// Fetch all locations (states in Nigeria)
export async function getLocations() {
	return client.fetch(`
      *[_type == "state" && name != "Remote"] | order(name asc) {
      _id,
      name,
      "slug": slug.current,
      "jobCount": count(*[_type == "job" && location._ref == ^._id])
  }`);
}

// Fetch jobs by location
// export async function getJobsByLocation(locationSlug: string) {
// 	return client.fetch(
// 		`*[_type == "job" && state->slug.current == $locationSlug] {
//           _id,
//           title,
//           company->,
//           "slug": slug.current,
//           salaryRange,
//           location->,
//           jobType->,
//           jobField->,
//           publishedAt,
//           description,
//           "logoUrl": company->logo.asset->url
//       }`,
// 		{ locationSlug },
// 	);
// }

export async function getJobsByLocation(locationSlug: string) {
	console.log("Fetching jobs for location slug:", locationSlug);

	const jobs = await client.fetch(
		`*[_type == "job" && state->slug.current == $locationSlug] {
          _id,
          title,
          "company": company->{
              _id,
              name,
              "logo": logo.asset->url
          },
          "slug": slug.current,
          salaryRange,
          "location": location->{
              _id,
              name
          },
          "jobType": jobType->{
              _id,
              name
          },
          "jobField": jobField->{
              _id,
              name
          },
          "level": level->{
              _id,
              name
          },
          publishedAt,
          description,
          summary
      }`,
		{ locationSlug },
	);

	console.log("Jobs found:", jobs.length);
	console.log("First job details:", jobs[0]);

	return jobs;
}

// Similar functions for education, field, and industry
export async function getEducationLevels() {
	return client.fetch(`
    *[_type == "education"] | order(level asc) {
      _id,
      level,
      slug,
      "jobCount": count(*[_type == "job" && references(^._id)])
    }
  `);
}

export async function getJobsByEducation(educationSlug: string) {
	return client.fetch(
		`
    *[_type == "job" && education->slug.current == $educationSlug] {
      _id,
      title,
      company,
      slug,
      salary,
      location->,
      education->,
      field->,
      industry->,
      postedDate,
      description,
      "logoUrl": company->logo.asset->url
    }
  `,
		{ educationSlug },
	);
}

// Add similar functions for fields and industries
