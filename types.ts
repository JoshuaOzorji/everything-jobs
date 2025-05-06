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
	value?: string;
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

export interface JobReference {
	_id: string;
	name: string;
	value?: string;
	slug?: {
		current: string;
	};
}

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
	location?: JobReference;
	jobType?: JobReference;
	education?: JobReference;
	jobField: JobReference;
	level?: JobReference;
	salaryRange?: {
		min: number;
		max: number;
	};
	publishedAt: string;
	deadline?: string;
	experienceRange?: {
		min: number;
		max: number;
	};
	requirements?: string[];
	responsibilities?: string[];
	recruitmentProcess?: string[];
	apply?: any[];

	jobFieldId?: string;
	jobTypeId?: string;
	levelId?: string;
	educationId?: string;
	locationId?: string;
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
	summary?: any[];
	location: JobReference;
	jobType: JobReference;
	level: JobReference;
	education: JobReference;
	jobField: JobReference;
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

// types/job.ts
export interface JobSubmission {
	title: string;
	summary: any[]; // For Portable Text format
	company: string; // Reference ID
	location: string; // Reference ID
	jobType: string; // Reference ID
	education: string; // Reference ID
	jobField: string; // Reference ID
	level: string; // Reference ID
	salaryRange: {
		min: number;
		max: number;
	};
	experienceRange: {
		min: number;
		max: number;
	};
	requirements: string[];
	responsibilities: string[];
	recruitmentProcess: string[];
	apply: any[]; // For Portable Text format
	submitterInfo: {
		name: string;
		email: string;
		phone: string;
	};
}

export interface ReferenceItem {
	_id: string;
	name: string;
}

export interface Company extends ReferenceItem {
	// Additional company-specific fields if needed
}

export interface JobType extends ReferenceItem {
	// Additional job type-specific fields if needed
}

export interface JobField extends ReferenceItem {
	// Additional job field-specific fields if needed
}

export interface JobLevel extends ReferenceItem {
	// Additional job level-specific fields if needed
}

export interface Education extends ReferenceItem {
	// Additional education-specific fields if needed
}

export interface State extends ReferenceItem {
	// Additional state-specific fields if needed
}
