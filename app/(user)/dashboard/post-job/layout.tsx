import { LoadingComponent } from "@/components/Loading";
import { Suspense } from "react";

export default function PostJobLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <Suspense fallback={<LoadingComponent />}>{children}</Suspense>;
}
