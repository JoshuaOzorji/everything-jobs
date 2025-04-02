// import AsideComponent from "@/components/AsideComponent";
// import LatestJobs from "@/components/LatestJobs";
// import Loading from "@/components/LoadingComponent";
// import SubLayout from "@/components/SubLayout";
// import React, { Suspense } from "react";

// const page = () => {
// 	return (
// 		<main>
// 			<SubLayout aside={<AsideComponent />}>
// 				<Suspense fallback={<Loading />}>
// 					<LatestJobs />
// 				</Suspense>
// 			</SubLayout>
// 		</main>
// 	);
// };

// export default page;

import AsideComponent from "@/components/AsideComponent";
import LatestJobs from "@/components/LatestJobs";
import { LoadingComponent } from "@/components/Loading";
import SubLayout from "@/components/SubLayout";
import { Suspense } from "react";

const page = () => {
	return (
		<main>
			<SubLayout aside={<AsideComponent />}>
				<Suspense fallback={<LoadingComponent />}>
					<LatestJobs />
				</Suspense>
			</SubLayout>
		</main>
	);
};

export default page;
