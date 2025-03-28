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

export async function getJobsByLocation(locationSlug: string) {
	const jobs = await client.fetch(
		groq`*[_type == "job" && defined(location) && location->slug.current == $locationSlug] {
          _id,
          title,
          "slug": {
            "current": slug.current
          },
          "company": company->{
              _id,
              name,
              logo{
              asset{
                _ref
              }
            } 
          },
          salaryRange,
          "location": location->{
              _id,
              name,
              slug
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

	return jobs;
}

// Similar functions for education, field, and industry
export async function getQualifications() {
	return client.fetch(`
      *[_type == "qualification"] | order(name asc) {
      _id,
      name,
      "slug": slug.current,
      "jobCount": count(*[_type == "job" && qualification._ref == ^._id])
  }`);
}

export async function getJobsByQualification(qualificationSlug: string) {
	const jobs = await client.fetch(
		groq`*[_type == "job" && defined(qualification) && qualification->slug.current == $qualificationSlug] {
          _id,
          title,
          "slug": {
            "current": slug.current
          },
          "company": company->{
              _id,
              name,
              logo{
              asset{
                _ref
              }
            } 
          },
          salaryRange,
          "location": location->{
              _id,
              name,
              slug
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
		{ qualificationSlug },
	);

	console.log("Jobs By Qualification", jobs);
	return jobs;
}

export async function getJobFields() {
	return client.fetch(`
      *[_type == "jobField"] | order(name asc) {
      _id,
      name,
      "slug": slug.current,
      "jobCount": count(*[_type == "job" && jobField._ref == ^._id])
  }`);
}

export async function getJobsByField(fieldSlug: string) {
	const jobs = await client.fetch(
		groq`*[_type == "job" && defined(jobField) && jobField->slug.current == $fieldSlug] {
          _id,
          title,
          "slug": {
            "current": slug.current
          },
          "company": company->{
              _id,
              name,
              logo{
              asset{
                _ref
              }
            } 
          },
          salaryRange,
          "location": location->{
              _id,
              name,
              slug
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
		{ fieldSlug },
	);

	return jobs;
}
