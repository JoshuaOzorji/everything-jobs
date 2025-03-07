export interface Job {
	_id: string;
	title: string;
	slug: { current: string };
	company: string;
	location: { _ref: string; name: string };
	jobType: { _ref: string; name: string };
	education: { _ref: string; name: string };
	category: { _ref: string; name: string };
	description: any[];
	publishedAt: string;
	mainImage: {
		asset: {
			_ref: string;
		};
		alt: string;
	};
}

export interface Location {
	_id: string;
	name: string;
	slug: { current: string };
}

export interface JobType {
	_id: string;
	name: string;
	slug: { current: string };
}

export interface Education {
	_id: string;
	name: string;
	slug: { current: string };
}

export interface Category {
	_id: string;
	name: string;
	slug: { current: string };
}

export interface JobCardProps {
	job: {
		_id: string;
		title: string;
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
		description?: any[];
		responsibilities?: string[];
	};
}
