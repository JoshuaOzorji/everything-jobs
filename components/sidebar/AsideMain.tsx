import { getTopLocations } from "./TopLocations";
import TopLocations from "./TopLocations";
import { getTrendingJobFields } from "./TrendingJobFields";
import TrendingJobFields from "./TrendingJobFields";
import JobTypes, { getJobTypes } from "./JobTypes";
import JobLevels, { getJobLevels } from "./JobLevels";

const AsideMain = async () => {
	const topLocations = await getTopLocations();
	const trendingJobFields = await getTrendingJobFields();
	const jobTypes = await getJobTypes();
	const jobLevels = await getJobLevels();
	return (
		<aside className='gap-2 p-4 bg-white border divide-y divide-gray-300 rounded-lg shadow-sm md:px-6'>
			<TopLocations locations={topLocations} />
			<TrendingJobFields jobFields={trendingJobFields} />
			<JobTypes jobTypes={jobTypes} />
			<JobLevels jobLevels={jobLevels} />
		</aside>
	);
};

export default AsideMain;
