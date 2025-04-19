"use client";
import { formatDate } from "@/lib/formatDate";
import { useEffect, useState } from "react";

export default function RelativeTime({ date }: { date: string }) {
	const [formattedTime, setFormattedTime] = useState("");

	useEffect(() => {
		setFormattedTime(formatDate(new Date(date)));
	}, [date]);

	return <>{formattedTime}</>;
}
