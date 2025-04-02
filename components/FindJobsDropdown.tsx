import Link from "next/link";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { findJobsDropdownItems } from "@/lib/data";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const FindJobsDropdown = () => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
			<DropdownMenuTrigger asChild>
				<span className='flex items-center gap-1 text-base cursor-pointer hover:text-pry animate'>
					Find Jobs
					<ChevronDown
						className={`w-4 h-4 transition-transform ${
							isOpen
								? "rotate-180"
								: "rotate-0"
						}`}
					/>
				</span>
			</DropdownMenuTrigger>
			<DropdownMenuContent className='px-2 py-3 mt-1 font-poppins'>
				{findJobsDropdownItems.map((item, index) => (
					<DropdownMenuItem
						key={index}
						className='text-base rounded-md hover:bg-acc p-0'
						onSelect={() =>
							setIsOpen(false)
						}>
						<Link
							href={item.href}
							className='block w-full h-full px-3 py-2'
							onClick={() =>
								setIsOpen(false)
							}>
							<p className='text-myBlack'>
								{item.label}
							</p>
						</Link>
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default FindJobsDropdown;
