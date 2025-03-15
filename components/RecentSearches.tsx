// Add to your search page
const [recentSearches, setRecentSearches] = useState<string[]>([]);

useEffect(() => {
	// Load recent searches from session storage
	const storedSearches = sessionStorage.getItem("recentSearches");
	if (storedSearches) {
		setRecentSearches(JSON.parse(storedSearches));
	}

	// Add current search to recent searches if there's a query
	if (query && query.trim() !== "") {
		const updatedSearches = [
			query,
			...recentSearches.filter((s) => s !== query),
		].slice(0, 5);
		setRecentSearches(updatedSearches);
		sessionStorage.setItem(
			"recentSearches",
			JSON.stringify(updatedSearches),
		);
	}
}, [query]);

// Add a Recent Searches component
const RecentSearches = () => {
	if (recentSearches.length === 0) return null;

	return (
		<div className='mt-4 p-3 bg-gray-50 rounded'>
			<h3 className='text-sm font-medium mb-2'>
				Recent Searches:
			</h3>
			<div className='flex flex-wrap gap-2'>
				{recentSearches.map((search) => (
					<button
						key={search}
						onClick={() => {
							const params =
								new URLSearchParams(
									searchParams.toString(),
								);
							params.set(
								"query",
								search,
							);
							router.push(
								`/search?${params.toString()}`,
							);
						}}
						className='px-2 py-1 text-xs bg-white border rounded hover:bg-gray-100'>
						{search}
					</button>
				))}
			</div>
		</div>
	);
};

// Add this component to your sidebar
