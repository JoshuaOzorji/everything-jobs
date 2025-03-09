import AsideComponent from "@/components/AsideComponent";
import LatestJobs from "@/components/LatestJobs";
import SubLayout from "@/components/SubLayout";
import React from "react";

const page = () => {
	return (
		<main>
			<SubLayout aside={<AsideComponent />}>
				<LatestJobs />
			</SubLayout>
		</main>
	);
};

export default page;
