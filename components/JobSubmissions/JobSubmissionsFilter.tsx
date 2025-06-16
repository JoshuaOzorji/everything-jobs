"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CiCalendarDate } from "react-icons/ci";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

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
			params.set("startDate", date.toISOString());
		} else {
			params.delete("startDate");
		}
		params.set("page", "1");
		router.push(`?${params.toString()}`);
	};

	return (
		<div className='flex gap-4 mb-4'>
			<Select
				onValueChange={onStatusChange}
				defaultValue='all'>
				<SelectTrigger className='w-[180px]'>
					<SelectValue placeholder='Select status' />
				</SelectTrigger>
				<SelectContent>
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
				<PopoverTrigger asChild>
					<Button
						variant={"outline"}
						className={cn(
							"w-[240px] justify-start text-left font-normal",
							!date &&
								"text-muted-foreground",
						)}>
						<CiCalendarDate className='mr-2 h-4 w-4' />
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
						initialFocus
					/>
				</PopoverContent>
			</Popover>
		</div>
	);
}
