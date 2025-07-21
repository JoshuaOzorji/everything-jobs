import { defineQuery, groq } from "next-sanity";
import { client } from "./client";
import {
	getDisplayNameForEducation,
	getDisplayNameForJobField,
} from "./utility";
import { Job } from "@/types/types";

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
  "jobFields": *[_type == "jobField"] { _id, name },
  "locations": *[_type == "state" && name != "Remote"] { _id, name }
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

export async function getJobsByLocation(
	locationSlug: string,
	page = 1,
	perPage = 10,
): Promise<{ jobs: Job[]; totalCount: number }> {
	const start = (page - 1) * perPage;
	const end = start + perPage;

	const jobs = await client.fetch(
		groq`*[_type == "job" && defined(location) && location->slug.current == $locationSlug] | order(publishedAt desc) [${start}...${end}] {
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
          name,
          "slug": slug.current 
      },
      "jobField": jobField->{
          _id,
          name,
          "slug": slug.current
      },
      "level": level->{
          _id,
          name,
          "slug": slug.current
      },
      publishedAt,
      description,
      summary
    }`,
		{ locationSlug },
	);

	// Get total count for pagination
	const totalCount = await client.fetch<number>(
		groq`count(*[_type == "job" && defined(location) && location->slug.current == $locationSlug])`,
		{ locationSlug },
	);

	return { jobs, totalCount };
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

export async function getJobsByField(
	fieldSlug: string,
	page = 1,
	perPage = 10,
): Promise<{ jobs: Job[]; totalCount: number }> {
	const start = (page - 1) * perPage;
	const end = start + perPage;

	const jobs = await client.fetch(
		groq`*[_type == "job" && defined(jobField) && jobField->slug.current == $fieldSlug] | order(publishedAt desc) [${start}...${end}] {
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
          name,
          "slug": slug.current 
      },
      "jobField": jobField->{
          _id,
          name,
          "slug": slug.current
      },
      "level": level->{
          _id,
          name,
          "slug": slug.current
      },
      publishedAt,
      description,
      summary
    }`,
		{ fieldSlug },
	);

	// Get total count for pagination
	const totalCount = await client.fetch<number>(
		groq`count(*[_type == "job" && defined(jobField) && jobField->slug.current == $fieldSlug])`,
		{ fieldSlug },
	);

	// Process jobs to add display names
	const processedJobs = jobs.map((job: any) => {
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

	return { jobs: processedJobs, totalCount };
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

export async function getJobsByEducation(
	educationSlug: string,
	page = 1,
	perPage = 10,
): Promise<{ jobs: Job[]; totalCount: number }> {
	const start = (page - 1) * perPage;
	const end = start + perPage;

	const jobs = await client.fetch(
		groq`*[_type == "job" && defined(education) && education->slug.current == $educationSlug] | order(publishedAt desc) [${start}...${end}] {
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
          name,
          "slug": slug.current 
      },
      "jobField": jobField->{
          _id,
          name,
          "slug": slug.current
      },
      "level": level->{
          _id,
          name,
          "slug": slug.current
      },
      
      publishedAt,
      description,
      summary
    }`,
		{ educationSlug },
	);

	// Get total count for pagination
	const totalCount = await client.fetch<number>(
		groq`count(*[_type == "job" && defined(education) && education->slug.current == $educationSlug])`,
		{ educationSlug },
	);

	return { jobs, totalCount };
}

export async function getRemoteJobs(
	page = 1,
	perPage = 10,
): Promise<{ jobs: Job[]; totalCount: number }> {
	const start = (page - 1) * perPage;
	const end = start + perPage;

	const jobs = await client.fetch<Job[]>(
		groq`*[_type == "job" && location->name == "Remote"] | order(publishedAt desc) [${start}...${end}] {
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
            name,
            "slug": slug.current 
        },
        "jobField": jobField->{
            _id,
            name,
            "slug": slug.current
        },
        "level": level->{
            _id,
            name,
            "slug": slug.current
        },
          publishedAt,
          description,
          summary
      }`,
	);

	// Get total count for pagination
	const totalCount = await client.fetch<number>(
		groq`count(*[_type == "job" && location->name == "Remote"])`,
	);

	return { jobs, totalCount };
}

export async function getJobTypes() {
	return client.fetch(`
    *[_type == "jobType"] | order(name asc) {
      _id,
      name,
      "slug": slug.current,
      "jobCount": count(*[_type == "job" && jobType._ref == ^._id])
    }
  `);
}

export async function getJobsByTypePaginated(
	typeSlug: string,
	page = 1,
	perPage = 10,
) {
	const start = (page - 1) * perPage;
	const end = start + perPage;

	const jobs = await client.fetch(
		groq`*[_type == "job" && defined(jobType) && jobType->slug.current == $typeSlug] | order(publishedAt desc) [${start}...${end}] {
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
            name,
            "slug": slug.current 
        },
        "jobField": jobField->{
            _id,
            name,
            "slug": slug.current
        },
        "level": level->{
            _id,
            name,
            "slug": slug.current
        },
      publishedAt,
      description,
      summary
    }`,
		{ typeSlug },
	);

	// Get total count for pagination
	const totalCount = await client.fetch<number>(
		groq`count(*[_type == "job" && defined(jobType) && jobType->slug.current == $typeSlug])`,
		{ typeSlug },
	);

	return { jobs, totalCount };
}

export async function getJobLevels() {
	return client.fetch(`
    *[_type == "jobLevel"] | order(name asc) {
      _id,
      name,
      "slug": slug.current,
      "jobCount": count(*[_type == "job" && level._ref == ^._id])
    }
  `);
}

export async function getJobsByLevelPaginated(
	levelSlug: string,
	page = 1,
	perPage = 10,
) {
	const start = (page - 1) * perPage;
	const end = start + perPage;

	const jobs = await client.fetch(
		groq`*[_type == "job" && defined(level) && level->slug.current == $levelSlug] | order(publishedAt desc) [${start}...${end}] {
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
          name,
          "slug": slug.current 
      },
      "jobField": jobField->{
          _id,
          name,
          "slug": slug.current
      },
      "level": level->{
          _id,
          name,
          "slug": slug.current
      },
      publishedAt,
      description,
      summary
    }`,
		{ levelSlug },
	);

	// Get total count for pagination
	const totalCount = await client.fetch<number>(
		groq`count(*[_type == "job" && defined(level) && level->slug.current == $levelSlug])`,
		{ levelSlug },
	);

	return { jobs, totalCount };
}

// export const jobQuery = defineQuery(groq`
//   *[_type == "job" && slug.current == $slug][0]{
//     _id,
//     title,
//     summary,
//     "company": company-> {
//       name,
//       logo,
//       "slug": slug.current
//     },
//     "location": location-> {
//       _id,
//       name
//     },
//     "jobType": jobType-> {
//       _id,
//       name
//     },
//     "education": education-> {
//       _id,
//       name,
//       value
//     },
//     "jobField": jobField-> {
//       _id,
//       name
//     },
//     "level": level-> {
//       _id,
//       name
//     },
//     salaryRange,
//     publishedAt,
//     deadline,
//     experienceRange,
//     requirements,
//     responsibilities,
//     recruitmentProcess,
//     apply,
//     // Reference IDs now come directly from the returned objects
//     "jobFieldId": jobField->_id,
//     "jobTypeId": jobType->_id,
//     "levelId": level->_id,
//     "educationId": education->_id,
//     "locationId": location->_id,
//   }
// `);

export const jobQuery = `
  *[_type == "job" && slug.current == $slug][0]{
    _id,
    title,
    summary,
    company->{
      name,
      logo,
      "slug": slug.current
    },
    location->{
      _id,
      name
    },
    jobType->{
      _id,
      name
    },
    education->{
      _id,
      name,
      value
    },
    jobField->{
      _id,
      name
    },
    level->{
      _id,
      name
    },
    salaryRange,
    publishedAt,
    deadline,
    experienceRange,
    requirements,
    responsibilities,
    recruitmentProcess,
    apply,
    // Extract reference IDs more efficiently
    "jobFieldId": jobField._ref,
    "jobTypeId": jobType._ref,
    "levelId": level._ref,
    "educationId": education._ref,
    "locationId": location._ref
  }
`;

export interface JobReference {
	_id: string;
	name: string;
	value?: string;
	slug: {
		current: string;
	};
}

type CurrentJob = {
	_id: string;
	jobField?: JobReference | string;
	jobType?: JobReference | string;
	level?: JobReference | string;
	education?: JobReference | string;
	location?: JobReference | string;
	jobFieldId?: string;
	jobTypeId?: string;
	levelId?: string;
	educationId?: string;
	locationId?: string;
};

// export const relatedJobsQuery = groq`
//   *[_type == "job" && _id != $currentJobId] {
//     _id,
//     title,
//     "slug": slug.current,
//     publishedAt,
//     "company": company->name,
//     "companySlug": company->slug.current,
//     "location": location->{
//           _id,
//           name,
//           slug
//       },
//       "jobType": jobType->{
//           _id,
//           name,
//           "slug": slug.current
//       },
//       "jobField": jobField->{
//           _id,
//           name,
//           "slug": slug.current
//       },
//       "level": level->{
//           _id,
//           name,
//           "slug": slug.current
//       },
//     "score":
//       (jobField->_id == $jobFieldId) * 5 +
//       (jobType->_id == $jobTypeId) * 3 +
//       (level->_id == $levelId) * 2 +
//       (education->_id == $educationId) * 2 +
//       (location->_id == $locationId) * 1
//   } | order(score desc, publishedAt desc)[0...4]
// `;

export const relatedJobsQuery = `
  *[
    _type == "job" && 
    _id != $currentJobId &&
    (
      jobField._ref in [$jobFieldId] ||
      jobType._ref in [$jobTypeId] ||
      location._ref in [$locationId]
    )
  ] | order(publishedAt desc)[0...6]{
    _id,
    title,
    "slug": slug.current,
    company->{
      name,
      logo
    },
    location->{
      name
    },
    publishedAt,
    salaryRange
  }
`;
