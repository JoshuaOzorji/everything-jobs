import { getTrendingLocations } from "./TrendingLocations";
import FeaturedLocations from "./TrendingLocations";
import { getTrendingJobFields } from "./TrendingJobFields";
import TrendingJobFields from "./TrendingJobFields";

const AsideMain = async () => {
	const featuredLocations = await getTrendingLocations();
	const trendingJobFields = await getTrendingJobFields();

	return (
		<aside className='bg-white p-4 rounded-lg shadow-sm border border-[#e6e6eb] divide-y divide-gray-200 gap-2 '>
			<FeaturedLocations locations={featuredLocations} />
			<TrendingJobFields jobFields={trendingJobFields} />
		</aside>
	);
};

export default AsideMain;
