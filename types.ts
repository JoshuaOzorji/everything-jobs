export interface Job {
	_id: string;
	title: string;
	slug: { current: string };
	company: string;
	location: { _ref: string; name: string };
	jobType: { _ref: string; name: string };
	education: { _ref: string; name: string };
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
		title: string;
		company: {
			name: string;
		};
		location: {
			city: string;
			country: string;
		};
		jobType: {
			name: string;
		};
		level: {
			name: string;
		};
		publishedAt: string;
		mainImage: {
			asset: {
				_ref: string;
			};
			alt?: string;
		};
		slug: {
			current: string;
		};
	};
}
