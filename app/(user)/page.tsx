import SubLayout from "@/components/SubLayout";
import { Suspense } from "react";
import LatestJobs from "@/components/LatestJobs";
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
			<SubLayout aside={<AsideMain />}>
				<Suspense fallback={<LoadingComponent />}>
					<LatestJobs page={page} />
				</Suspense>
			</SubLayout>
		</main>
	);
}

export default Homepage;
