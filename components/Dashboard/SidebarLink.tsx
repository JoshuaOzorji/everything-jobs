"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SidebarLinkProps } from "@/types/types";

const SidebarLink = ({ href, label }: SidebarLinkProps) => {
	const pathname = usePathname();
	const isActive = pathname === href;

	return (
		<Link
			href={href}
			className={`block px-4 py-2 rounded-lg transition-colors ${
				isActive
					? "bg-blue-700 text-white"
					: "text-gray-300 hover:bg-blue-600 hover:text-white"
			}`}>
			{label}
		</Link>
	);
};

export default SidebarLink;
