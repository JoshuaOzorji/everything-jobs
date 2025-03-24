import { groq } from "next-sanity";

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
