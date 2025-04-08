import { groq } from "next-sanity";
import { client } from "./client";
import { RelatedJob } from "@/components/RelatedJobs";
import { getDisplayNameForEducation, getDisplayNameForJobField } from "./data";

export const searchJobsQuery = groq`
  *[_type == "job" && 
    (title match $q + "*" || company->name match $q + "*") &&
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
    deadline,
    summary
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
	const jobFields = await client.fetch(`
    *[_type == "jobField"] | order(name asc) {
      _id,
      name,
      "slug": slug.current,
      "jobCount": count(*[_type == "job" && jobField._ref == ^._id])
    }
  `);

	return jobFields.map(
		(field: {
			_id: string;
			name: string;
			slug: string;
			jobCount: number;
		}) => ({
			...field,
			displayName: getDisplayNameForJobField(field.name),
		}),
	);
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

	return jobs.map((job: any) => {
		if (job.jobField && job.jobField.name) {
			return {
				...job,
				jobField: {
					...job.jobField,
					displayName: getDisplayNameForJobField(
						job.jobField.name,
					),
				},
			};
		}
		return job;
	});
}

export async function getEducationLevels() {
	const educationLevels = await client.fetch(`
    *[_type == "education"] | order(name asc) {
      _id,
      name,
      "slug": slug.current,
      "jobCount": count(*[_type == "job" && education._ref == ^._id])
    }
  `);

	// Map the display names
	return educationLevels.map(
		(level: {
			_id: string;
			name: string;
			slug: string;
			jobCount: number;
		}) => ({
			...level,
			displayName: getDisplayNameForEducation(level.name),
		}),
	);
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

	return jobs.map((job: any) => {
		if (job.education && job.education.name) {
			return {
				...job,
				education: {
					...job.education,
					displayName: getDisplayNameForEducation(
						job.education.name,
					),
				},
			};
		}
		return job;
	});
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

export interface JobReference {
	_id: string;
	jobField: { _ref: string };
	company: { _ref: string };
	jobType: { _ref: string };
	location: { _ref: string };
}

export async function fetchRelatedJobs(
	currentJob: JobReference,
): Promise<RelatedJob[]> {
	return client.fetch(
		`*[_type == "job" && 
      _id != $currentJobId && 
      (!defined(deadline) || deadline > now())
    ] {
      _id,
      title,
      "slug": slug.current,
      "company": company->name,
      "companyLogo": company->logo.asset->url,
      "location": location->name,
      "jobType": jobType->name,
      publishedAt,
      "score": 0
        + (jobField._ref == $jobFieldRef ? 5 : 0)
        + (company._ref == $companyRef ? 4 : 0)
        + (jobType._ref == $jobTypeRef ? 3 : 0)
        + (location._ref == $locationRef ? 3 : 0)
    } | order(score desc) [0...4]`,
		{
			currentJobId: currentJob._id,
			jobFieldRef: currentJob.jobField._ref,
			companyRef: currentJob.company._ref,
			jobTypeRef: currentJob.jobType._ref,
			locationRef: currentJob.location._ref,
		},
	);
}
