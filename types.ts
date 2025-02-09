export interface Job {
	_id: string;
	title: string;
	slug: { current: string };
	company: string;
	location: { _ref: string; name: string };
	jobType: { _ref: string; name: string };
	qualification: { _ref: string; name: string };
	category: { _ref: string; name: string };
	description: string;
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

export interface Qualification {
	_id: string;
	name: string;
	slug: { current: string };
}

export interface Category {
	_id: string;
	name: string;
	slug: { current: string };
}
