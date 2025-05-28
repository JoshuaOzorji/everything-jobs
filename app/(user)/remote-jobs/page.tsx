import { Metadata } from "next";
import { getRemoteJobs } from "@/sanity/lib/queries";
import Pagination from "@/components/PaginationComponent";
import AsideMain from "@/components/sidebar/AsideMain";
import SubLayout from "@/components/SubLayout";
import JobCardCategories from "@/components/JobCardCategories";

export const metadata: Metadata = {
	title: "Remote Jobs | Work from Anywhere",
	description:
		"Browse remote job opportunities across Nigeria. Find flexible, work-from-home positions in various industries and roles.",
	keywords: "remote jobs Nigeria, work from home, online jobs, remote work opportunities",
	openGraph: {
		title: "Remote Jobs | Work from Anywhere",
		description:
			"Discover remote job opportunities that allow you to work from anywhere in Nigeria.",
		type: "website",
	},
};

type SearchParams = {
	page?: string;
};

export default async function RemoteJobsPage({
	searchParams,
}: {
	searchParams: Promise<SearchParams>;
}) {
	const resolvedSearchParams = await searchParams;

	// Convert page to number, default to 1
	const currentPage = resolvedSearchParams?.page
		? parseInt(resolvedSearchParams.page, 10)
		: 1;
	const perPage = 10;

	const { jobs, totalCount } = await getRemoteJobs(currentPage, perPage);

	return (
		<SubLayout
			aside={
				<div className='hidden md:block'>
					<AsideMain />
				</div>
			}>
			<div className='page-container'>
				<h1 className='page-h1'>
					Remote Jobs in Nigeria
				</h1>

				<div className='page-sub-div'>
					<p className='page-p'>
						Browse {totalCount} remote job
						opportunities. Work flexibly
						from anywhere in Nigeria or
						beyond.
					</p>
				</div>

				{jobs.length > 0 ? (
					<div className='flex flex-col gap-2'>
						{jobs.map((job) => (
							<JobCardCategories
								key={job._id}
								job={{
									...job,
									slug: job
										.slug
										.current,
								}}
							/>
						))}
					</div>
				) : (
					<div className='py-12 text-center'>
						<h2 className='text-xl font-semibold'>
							No remote jobs currently
							available
						</h2>
						<p className='mt-2'>
							Check back later for new
							remote job
							opportunities.
						</p>
					</div>
				)}

				{totalCount > perPage && (
					<Pagination
						currentPage={currentPage}
						total={totalCount}
						perPage={perPage}
					/>
				)}
			</div>
		</SubLayout>
	);
}
