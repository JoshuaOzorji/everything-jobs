import Link from "next/link";

interface CategoryListProps {
	items: any[];
	basePath: string;
	nameKey: string;
	slugKey: string;
	countKey: string;
}

export default function CategoryList({
	items,
	basePath,
	nameKey,
	slugKey,
	countKey,
}: CategoryListProps) {
	// Helper function to get nested property by string path (e.g. "slug.current")
	const getNestedProperty = (obj: any, path: string) => {
		const keys = path.split(".");
		return keys.reduce(
			(o, key) => (o && o[key] !== undefined ? o[key] : null),
			obj,
		);
	};

	return (
		<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
			{items.map((item) => {
				const name = getNestedProperty(item, nameKey);
				const slug = getNestedProperty(item, slugKey);
				const count = getNestedProperty(item, countKey);

				return (
					<Link
						href={`${basePath}/${slug}`}
						key={item._id}
						className='block p-6 border rounded-lg hover:shadow-md transition-shadow'>
						<div className='flex justify-between items-center'>
							<h2 className='text-xl font-semibold'>
								{name}
							</h2>
							<span className='bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded'>
								{count} jobs
							</span>
						</div>
					</Link>
				);
			})}
		</div>
	);
}
