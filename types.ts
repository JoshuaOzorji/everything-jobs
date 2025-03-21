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
}

// export interface CompanyWithJobs extends Company {
// 	jobs?: {
// 		_id: string;
// 		title: string;
// 		summary: any[];
// 		slug: { current: string };
// 		publishedAt: string;
// 		deadline?: string;
// 		jobType: { name: string };
// 		location: { name: string };
// 		level: { name: string };
// 	}[];
// }

export interface Location {
	name: string;
	states: string[];
	slug: { current: string };
}

export interface JobType {
	name: string;
}

export interface Qualification {
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
export interface Job {
	_id: string;
	title: string;
	slug: { current: string };
	summary?: any[];
	company: Company;
	location: Location;
	jobType: JobType;
	qualification: Qualification;
	jobField: JobField;
	salaryRange: SalaryRange;
	publishedAt: string;
	deadline: string;
	level: JobLevel;
	experienceRange: ExperienceRange;
	requirements: string[];
	responsibilities: string[];
	recruitmentProcess: string[];
	mainImage: MainImage;
	apply: any[];
}
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
			states?: string[];
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
	location: string[];
	jobType: string;
	level: string;
	qualification: string;
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
	qualifications: Filter[];
	jobFields: Filter[];
}
