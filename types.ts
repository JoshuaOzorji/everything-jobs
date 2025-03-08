export interface Company {
	name: string;
}

export interface Location {
	name: string;
}

export interface JobType {
	name: string;
}

export interface Qualification {
	title: string;
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
	title: string;
	slug: { current: string };
	summary: any[];
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
