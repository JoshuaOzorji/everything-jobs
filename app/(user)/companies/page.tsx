import { groq } from "next-sanity";
import { client } from "@/sanity/lib/client";
import CompanyCard from "@/components/CompanyCard";
import { Company } from "@/types/types";
import SubLayout from "@/components/SubLayout";
import { Suspense } from "react";
import { LoadingComponent } from "@/components/Loading";
import CompaniesAside from "@/components/CompaniesAside";
import Pagination from "@/components/Pagination";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

type SearchParams = {
	page?: string;
};

export const metadata: Metadata = {
	title: "Companies | Browse Companies in Nigeria",
	description:
		"Browse companies with job opportunities in Nigeria. Find your next employer.",
	keywords: "companies, employers, organizations, Nigerian jobs",
};

async function getCompanies(page = 1, perPage = 10) {
	const start = (page - 1) * perPage;
	const end = start + perPage;

	const companies = await client.fetch<Company[]>(
		groq`*[_type == "company"] | order(name asc) [${start}...${end}] {
      _id,
      name,
      logo {
        asset->,
        alt
      },
      description,
      "slug": slug.current,
      website
    }`,
	);

	// Get total count for pagination
	const totalCount = await client.fetch<number>(
		groq`count(*[_type == "company"])`,
	);

	return { companies, totalCount };
}

export default async function CompaniesPage({
	searchParams,
}: {
	searchParams: Promise<SearchParams>;
}) {
	// Await the searchParams promise
	const resolvedSearchParams = await searchParams;

	// Convert page to number, default to 1
	const currentPage = resolvedSearchParams?.page
		? parseInt(resolvedSearchParams.page, 10)
		: 1;
	const perPage = 52;

	const { companies, totalCount } = await getCompanies(
		currentPage,
		perPage,
	);

	return (
		<>
			<SubLayout aside={<CompaniesAside />}>
				<div className='page-container'>
					<h1 className='mb-6 text-xl font-bold md:text-3xl font-poppins'>
						Companies
					</h1>

					{companies.length === 0 ? (
						<div className='py-12 text-center'>
							<p className='text-xl text-myBlack'>
								No companies
								found
							</p>
						</div>
					) : (
						<>
							<div className='grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
								{companies.map(
									(
										company,
									) => (
										<Suspense
											key={
												company._id
											}
											fallback={
												<div className='flex items-center justify-center w-full h-full min-h-[200px]'>
													<LoadingComponent />
												</div>
											}>
											<CompanyCard
												company={
													company
												}
											/>
										</Suspense>
									),
								)}
							</div>

							{totalCount >
								perPage && (
								<Pagination
									currentPage={
										currentPage
									}
									total={
										totalCount
									}
									perPage={
										perPage
									}
								/>
							)}
						</>
					)}
				</div>
			</SubLayout>
		</>
	);
}
