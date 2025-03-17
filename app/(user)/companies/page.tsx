// app/companies/page.tsx
import { groq } from "next-sanity";
import { client } from "@/sanity/lib/client";
import CompanyCard from "@/components/CompanyCard";
import { Company } from "@/types";

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
		<div className='container mx-auto py-8 px-4'>
			<h1 className='text-3xl font-bold mb-8'>Companies</h1>

			{companies.length === 0 ? (
				<div className='text-center py-12'>
					<p className='text-xl text-gray-600'>
						No companies found
					</p>
				</div>
			) : (
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
					{companies.map((company) => (
						<CompanyCard
							key={company._id}
							company={company}
						/>
					))}
				</div>
			)}
		</div>
	);
}
