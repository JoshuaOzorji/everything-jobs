export const formatDate = (date: Date): string => {
	const now = new Date();
	const diff = now.getTime() - date.getTime();
	const secondsDiff = Math.floor(diff / 1000);
	const minutesDiff = Math.floor(diff / (1000 * 60));
	const hoursDiff = Math.floor(diff / (1000 * 60 * 60));
	const daysDiff = Math.floor(diff / (1000 * 60 * 60 * 24));

	if (secondsDiff < 30) {
		return "now";
	} else if (minutesDiff < 60) {
		return `${minutesDiff}m`;
	} else if (hoursDiff < 24) {
		return `${hoursDiff}h`;
	} else if (daysDiff < 7) {
		return `${daysDiff}d`;
	} else {
		// For dates older than 7 days, format as "MMM DD" or "MMM DD YYYY"
		if (now.getFullYear() === date.getFullYear()) {
			return date.toLocaleDateString("en-US", {
				month: "short",
				day: "numeric",
				timeZone: "UTC",
			});
		} else {
			return date.toLocaleDateString("en-US", {
				month: "short",
				day: "numeric",
				year: "numeric",
				timeZone: "UTC",
			});
		}
	}
};
