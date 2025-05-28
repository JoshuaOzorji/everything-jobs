import SubLayout from "@/components/SubLayout";
import { Suspense } from "react";
import JobsList from "@/components/JobsList";
import AsideMain from "@/components/sidebar/AsideMain";
import { LoadingComponent } from "@/components/Loading";

type HomepageProps = {
	searchParams: Promise<{
		page?: string;
	}>;
};

async function Homepage({ searchParams }: HomepageProps) {
	const params = await searchParams;
	const pageParam = params?.page;
	const page = pageParam ? parseInt(pageParam) : 1;

	return (
		<main>
			<SubLayout
				aside={
					<div className='hidden md:block'>
						<AsideMain />
					</div>
				}>
				<Suspense fallback={<LoadingComponent />}>
					<JobsList page={page} />
				</Suspense>
			</SubLayout>
		</main>
	);
}

export default Homepage;
