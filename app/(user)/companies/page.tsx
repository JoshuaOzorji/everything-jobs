import { groq } from "next-sanity";
import { client } from "@/sanity/lib/client";
import CompanyCard from "@/components/CompanyCard";
import { Company } from "@/types";
import SubLayout from "@/components/SubLayout";
import AsideMain from "@/components/sidebar/AsideMain";
import { Suspense } from "react";
import { LoadingComponent } from "@/components/Loading";

// This ensures the page will be dynamically rendered
export const dynamic = "force-dynamic";

const companyQuery = groq`
  *[_type == "company"] | order(name asc) {
    _id,
    name,
    logo {
      asset->,
      alt
    },
    description,
    slug,
    website
  }
`;

async function getCompanies() {
	return await client.fetch<Company[]>(companyQuery);
}

export default async function CompaniesPage() {
	const companies = await getCompanies();

	return (
		<>
			<SubLayout aside={<AsideMain />}>
				<div>
					<h1 className='mb-6 text-xl font-bold  md:text-3xl font-poppins'>
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
						<div className='grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
							{companies.map(
								(company) => (
									<Suspense
										key={
											company._id
										}
										fallback={
											<div className='flex items-center justify-center w-full h-full min-h-[150px]'>
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
					)}
				</div>
			</SubLayout>
		</>
	);
}
