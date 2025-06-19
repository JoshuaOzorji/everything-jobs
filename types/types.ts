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
	slug: string;
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
			slug?: {
				current: string;
			};
		};
		level?: {
			name: string;
			slug?: {
				current: string;
			};
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

// Add this new interface
export interface SearchJobResult {
	_id: string;
	title: string;
	slug: string;
	company: string;
	companyLogo?: string;
	summary?: any[];
	location: string;
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

export interface JobSubmission {
	title: string;
	companyName: string;
	summary: any[] | string; // Allow both array and string
	locationName: string;
	jobTypeName: string;
	educationLevel: string;
	jobFieldName: string;
	experienceLevel: string;
	deadline?: string | Date;
	apply: any[] | string;
	salaryRange: {
		min: number | string; // Allow both number and string
		max: number | string; // Allow both number and string
	};
	experienceRange: {
		min: number | string; // Allow both number and string
		max: number | string; // Allow both number and string
	};
	requirements: string[] | string; // Allow both array and string
	responsibilities: string[] | string; // Allow both array and string
	recruitmentProcess?: string[] | string; // Allow both array and string
	submitterInfo: {
		name: string;
		email: string;
		phoneNumber?: string;
	};
}

export interface DashboardLayoutProps {
	children: React.ReactNode;
}

export interface SidebarLinkProps {
	href: string;
	label: string;
	icon?: React.ReactNode;
}

export interface CompanyProfileUpdate {
	name: string;
	website?: string;
	industry: string;
	description?: string;
	logo?: FileList;
}

export interface Industry {
	_id: string;
	name: string;
}

export interface JobSubmissionItem {
	_id: string;
	title: string;
	company: {
		name: string;
		logo?: any;
	};
	location: string;
	jobType: string;
	status: "pending" | "approved" | "rejected";
	submittedAt: string;
	statusUpdatedAt: string;
	deadline?: string;
}

export interface JobSubmissionsResponse {
	submissions: JobSubmissionItem[];
	total: number;
}
