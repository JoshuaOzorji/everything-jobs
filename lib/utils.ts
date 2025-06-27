import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

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

export function formatURL(rawValue: string): string {
	let value = rawValue.trim();

	// Remove all protocols if user mistakenly adds multiple
	value = value.replace(/^(https?:\/\/)+/i, "");

	// Remove trailing slashes
	value = value.replace(/\/+$/, "");

	// Extract domain + path if user typed full thing
	const match = value.match(/^([^\/?#]+)([\/?#].*)?$/);

	if (!match) return `https://${value}`;

	let [_, domain, rest = ""] = match;

	// Lowercase domain for consistency
	domain = domain.toLowerCase();

	// Final formatted URL
	return `https://${domain}${rest}`;
}
