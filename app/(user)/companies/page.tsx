import { groq } from "next-sanity";
import { client } from "@/sanity/lib/client";
import CompanyCard from "@/components/CompanyCard";
import { Company } from "@/types";
import SubLayout from "@/components/SubLayout";
import AsideComponent from "@/components/AsideComponent";

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
			<SubLayout aside={<AsideComponent />}>
				<div className=''>
					<h1 className='p-2 mb-6 text-xl font-bold bg-white rounded-md md:text-3xl font-poppins'>
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
									<CompanyCard
										key={
											company._id
										}
										company={
											company
										}
									/>
								),
							)}
						</div>
					)}
				</div>
			</SubLayout>
		</>
	);
}
