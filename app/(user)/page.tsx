import AsideMain from "@/components/sidebar/AsideMain";
import LatestJobs from "@/components/LatestJobs";
import { LoadingComponent } from "@/components/Loading";
import SubLayout from "@/components/SubLayout";
import { Suspense } from "react";

const page = () => {
	return (
		<main>
			<SubLayout aside={<AsideMain />}>
				<Suspense fallback={<LoadingComponent />}>
					<LatestJobs />
				</Suspense>
			</SubLayout>
		</main>
	);
};

export default page;
