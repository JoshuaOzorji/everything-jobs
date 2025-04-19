import SubLayout from "@/components/SubLayout";
import { Suspense } from "react";
import LatestJobs from "@/components/LatestJobs";
import AsideMain from "@/components/sidebar/AsideMain";
import { LoadingComponent } from "@/components/Loading";

// Type for the Homepage props
type HomepageProps = {
	searchParams?: {
		page?: string;
	};
};

// Mark as async function to handle searchParams
async function Homepage({ searchParams }: HomepageProps) {
	// Await searchParams before accessing its properties
	const pageParam = (await searchParams)?.page;
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
