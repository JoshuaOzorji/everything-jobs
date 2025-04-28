export const formatDate = (date: Date): string => {
	const now = new Date();
	const diff = now.getTime() - date.getTime();
	const minutesDiff = Math.floor(diff / (1000 * 60));
	const hoursDiff = Math.floor(diff / (1000 * 60 * 60));
	const daysDiff = Math.floor(diff / (1000 * 60 * 60 * 24));

	if (minutesDiff < 1) {
		return "just now";
	} else if (minutesDiff < 60) {
		return `${minutesDiff} min${minutesDiff > 1 ? "s" : ""} `;
	} else if (hoursDiff < 24) {
		return `${hoursDiff} hour${hoursDiff > 1 ? "s" : ""} `;
	} else if (daysDiff === 1) {
		return "yesterday";
	} else if (daysDiff < 7) {
		return `${daysDiff} d`;
	} else if (daysDiff < 30) {
		const weeksDiff = Math.floor(daysDiff / 7);
		return `${weeksDiff}w`;
	} else if (daysDiff < 365) {
		const monthsDiff = Math.floor(daysDiff / 30);
		return `${monthsDiff}mo `;
	} else {
		return date.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
			timeZone: "UTC",
		});
	}
};
