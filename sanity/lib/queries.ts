import { groq } from "next-sanity";
import { client } from "./client";

export const searchJobsQuery = groq`
  *[_type == "job" && 
    (title match $q + "*" || company->name match $q + "*") &&
    // ($location == "" || location->states[] match $location) &&
    ($location == "" || location->name match $location) &&
    ($jobType == "" || jobType->name == $jobType) &&
    ($jobLevel == "" || level->name == $jobLevel) &&
    ($education == "" || education->name == $education) &&
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
    "education": education->name,
    "jobField": jobField->name,
    salaryRange,
    publishedAt,
    deadline
  } | order(publishedAt desc)[0...50]
`;

export const getFiltersQuery = groq`{
  "jobTypes": *[_type == "jobType"] { _id, name },
  "jobLevels": *[_type == "jobLevel"] { _id, name },
  "educationLevels": *[_type == "education"] { _id, name },
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

export async function getEducationLevels() {
	return client.fetch(`
      *[_type == "education"] | order(name asc) {
      _id,
      name,
      "slug": slug.current,
      "jobCount": count(*[_type == "job" && education._ref == ^._id])
  }`);
}

export async function getJobsByEducation(educationSlug: string) {
	const jobs = await client.fetch(
		groq`*[_type == "job" && defined(education) && education->slug.current == $educationSlug] {
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
          level->{
            name
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
          "education": education->{
              _id,
              name
          },
          publishedAt,
          description,
          summary
      }`,
		{ educationSlug },
	);

	return jobs;
}

export async function getRemoteJobs() {
	const jobs = await client.fetch(
		groq`*[_type == "job" && location->name == "Remote"] {
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
          level->{
            name
          }, 
          "jobField": jobField->{
              _id,
              name
          },
          "education": education->{
              _id,
              name
          },
          publishedAt,
          description,
          summary
      }`,
	);

	return jobs;
}
