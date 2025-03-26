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
		<div className='grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3 md:gap-4'>
			{items.map((item) => {
				console.log("Category Item:", item);
				const name = getNestedProperty(item, nameKey);
				// const slug = getNestedProperty(item, slugKey);
				const slug =
					item.slug ||
					getNestedProperty(item, slugKey);
				const count = getNestedProperty(item, countKey);

				if (!slug) {
					console.warn(
						"Skipping item with null slug:",
						item,
					);
					return null;
				}

				return (
					<Link
						href={`${basePath}/${slug}`}
						key={item._id}
						className='block p-4 transition-shadow bg-white border rounded-lg md:p-6 hover:shadow-sm'>
						<div className='flex items-center justify-between'>
							<h2 className='text-base md:text-xl md:font-semibold font-poppins text-myBlack hover:underline'>
								{name}
							</h2>
							<span className='bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded font-openSans'>
								{count || 0}{" "}
								jobs
							</span>
						</div>
					</Link>
				);
			})}
		</div>
	);
}
