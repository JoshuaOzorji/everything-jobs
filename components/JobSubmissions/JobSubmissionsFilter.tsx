"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

export default function JobSubmissionsFilter() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [date, setDate] = useState<Date>();

	const onStatusChange = (status: string) => {
		const params = new URLSearchParams(searchParams);
		params.set("status", status);
		params.set("page", "1");
		router.push(`?${params.toString()}`);
	};

	const onDateSelect = (date: Date | undefined) => {
		setDate(date);
		const params = new URLSearchParams(searchParams);
		if (date) {
			params.set(
				"startDate",
				date.toISOString().split("T")[0],
			);
		} else {
			params.delete("startDate");
		}
		params.set("page", "1");
		router.push(`?${params.toString()}`);
	};

	const clearFilters = () => {
		setDate(undefined);
		router.push("?");
	};

	return (
		<div className='flex flex-wrap gap-4 p-2 bg-white rounded-lg shadow-sm font-openSans'>
			<Select
				onValueChange={onStatusChange}
				defaultValue='all'>
				<SelectTrigger className='w-[180px] px-2 text-xs md:text-sm'>
					<SelectValue placeholder='Filter by status' />
				</SelectTrigger>
				<SelectContent className=''>
					<SelectItem value='all'>
						All Status
					</SelectItem>
					<SelectItem value='pending'>
						Pending
					</SelectItem>
					<SelectItem value='approved'>
						Approved
					</SelectItem>
					<SelectItem value='rejected'>
						Rejected
					</SelectItem>
				</SelectContent>
			</Select>

			<Popover>
				<PopoverTrigger
					asChild
					className='px-2 text-xs md:text-sm'>
					<Button
						variant='outline'
						className={cn(
							"w-[240px] justify-start text-left font-normal",
							!date &&
								"text-muted-foreground",
						)}>
						<CalendarIcon className='mr-2 h-4 w-4' />
						{date ? (
							format(date, "PPP")
						) : (
							<span>
								Filter by date
							</span>
						)}
					</Button>
				</PopoverTrigger>

				<PopoverContent
					className='w-auto p-0'
					align='start'>
					<Calendar
						mode='single'
						selected={date}
						onSelect={onDateSelect}
						autoFocus={false}
					/>
				</PopoverContent>
			</Popover>

			<Button
				variant='outline'
				onClick={clearFilters}
				className='ml-auto px-2 text-xs md:text-sm'>
				Clear Filters
			</Button>
		</div>
	);
}
