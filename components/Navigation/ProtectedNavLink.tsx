// components/Navigation/ProtectedNavLink.tsx
"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { useCompanyProfileModal } from "@/hooks/useCompanyProfileModal";
import CompanyProfileModal from "@/components/Company/CompanyProfileModal";

interface ProtectedNavLinkProps {
	href: string;
	children: ReactNode;
	className?: string;
	requiresCompanyProfile?: boolean;
	onClick?: () => void;
}

export default function ProtectedNavLink({
	href,
	children,
	className,
	requiresCompanyProfile = false,
	onClick,
}: ProtectedNavLinkProps) {
	const {
		showModal,
		hasCompanyProfile,
		isLoading,
		handleProtectedNavigation,
		handleCreateProfile,
		handleCancel,
	} = useCompanyProfileModal();

	const handleClick = async (e: React.MouseEvent) => {
		if (onClick) {
			onClick();
		}

		if (requiresCompanyProfile && !isLoading) {
			const canNavigate =
				await handleProtectedNavigation(href);
			if (!canNavigate) {
				e.preventDefault();
			}
		}
	};

	// If it's a protected route and user doesn't have company profile, show as button
	if (requiresCompanyProfile && !hasCompanyProfile && !isLoading) {
		return (
			<>
				<button
					onClick={handleClick}
					className={className}
					type='button'>
					{children}
				</button>
				<CompanyProfileModal
					isOpen={showModal}
					onClose={handleCancel}
					onCreateProfile={handleCreateProfile}
				/>
			</>
		);
	}

	// Normal navigation for non-protected routes or when user has company profile
	return (
		<Link href={href} className={className} onClick={handleClick}>
			{children}
		</Link>
	);
}
