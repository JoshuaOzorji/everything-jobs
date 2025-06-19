export function processTextAreaToArray(text: string): string[] {
	return text
		.split("\n")
		.map((line) => line.trim())
		.filter((line) => line.length > 0);
}

export function validateSalaryRange(min: number, max: number): boolean {
	return !isNaN(min) && !isNaN(max) && min <= max && min >= 0;
}

export function formatDate(date: Date | string): string {
	return new Date(date).toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
}

export function validateDeadline(deadline: string): boolean {
	const deadlineDate = new Date(deadline);
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	return deadlineDate >= today;
}
