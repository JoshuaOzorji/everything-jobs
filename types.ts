export interface Company {
	_id: string;
	name: string;
	logo?: {
		asset?: {
			_ref: string;
		};
		alt?: string;
	};
	description?: string;
	slug: {
		current: string;
	};
	website?: string;
	industry?: {
		name: string;
		slug: { current: string };
	};
	jobs?: Job[];
	totalJobs?: number;
}

export interface PaginatedCompanyData extends Company {
	pagination: {
		currentPage: number;
		total: number;
		perPage: number;
	};
}

export interface State {
	name: string;
	slug: { current: string };
}

export interface JobType {
	name: string;
}

export interface Education {
	name: string;
}

export interface JobField {
	name: string;
}

export interface JobLevel {
	name: string;
}

export interface SalaryRange {
	min: number;
	max: number;
}

export interface ExperienceRange {
	min: number;
	max: number;
}

export interface MainImage {
	asset: {
		url: string;
	};
	alt: string;
}
// export interface Job {
// 	_id: string;
// 	title: string;
// 	slug: { current: string };
// 	summary?: any[];
// 	company: Company;
// 	location: State;
// 	jobType: JobType;
// 	education: Education;
// 	jobField: JobField;
// 	salaryRange: SalaryRange;
// 	publishedAt: string;
// 	deadline: string;
// 	level: JobLevel;
// 	experienceRange: ExperienceRange;
// 	requirements: string[];
// 	responsibilities: string[];
// 	recruitmentProcess: string[];
// 	mainImage: MainImage;
// 	apply: any[];
// }

export type Job = {
	_id: string;
	slug: {
		current: string;
	};
	title: string;
	summary: any[];
	company: {
		name: string;
		logo?: {
			asset?: {
				_ref: string;
			};
		};
		slug: string;
	};
	location?: {
		name: string;
		slug?: {
			current: string;
		};
	};
	jobType: {
		name: string;
	};
	education?: string;
	jobField: string;
	salaryRange?: {
		min: number;
		max: number;
	};
	publishedAt: string;
	deadline?: string;
	level?: {
		name: string;
	};
	experienceRange?: {
		min: number;
		max: number;
	};
	requirements?: string[];
	responsibilities?: string[];
	recruitmentProcess?: string[];
	apply?: any[];
};

export interface JobCardProps {
	job: {
		_id: string;
		title: string;
		slug: string;
		company: {
			name: string;
			logo?: {
				asset?: {
					_ref: string;
				};
			};
		};
		location?: {
			name: string;
			slug?: {
				current: string;
			};
		};
		jobType?: {
			name: string;
		};
		level?: {
			name: string;
		};
		publishedAt: string;
		summary?: any[];
		responsibilities?: string[];
	};
}

export interface JobQuery {
	_id: string;
	title: string;
	slug: string;
	company: string;
	companyLogo?: string;
	location: string;
	summary?: any[];
	jobType: string;
	level: string;
	education: string;
	jobField: string;
	salaryRange: { min: number; max: number };
	publishedAt: string;
	deadline: string;
}

export interface Filter {
	_id: string;
	name: string;
}

export interface FilterOptions {
	jobTypes: Filter[];
	jobLevels: Filter[];
	educationLevels: Filter[];
	jobFields: Filter[];
	locations: { _id: string; name: string }[];
}
