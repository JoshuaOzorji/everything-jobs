import { useEffect, useState, useCallback, useRef } from "react";

const DRAFT_KEY = "job_post_draft";

export interface JobDraft {
	title: string;
	summary: string;
	location: string;
	jobType: string;
	education: string;
	jobField: string;
	level: string;
	deadline?: string;
	salaryRange: {
		min: number;
		max: number;
	};
	requirements: string;
	responsibilities: string;
	recruitmentProcess: string;
	apply: string;
}

function blocksToString(blocks: any[] | string): string {
	if (!blocks) return "";
	if (typeof blocks === "string") return blocks;
	// Join all block children text with double newlines
	return blocks
		.map(
			(block) =>
				block.children
					?.map((child: any) => child.text)
					.join("") ?? "",
		)
		.join("\n\n");
}

function arrayToString(arr: string[] | string): string {
	if (!arr) return "";
	if (typeof arr === "string") return arr;
	return arr.join("\n");
}

function safeStringify(obj: any): string {
	try {
		return JSON.stringify(obj);
	} catch (error) {
		console.error("Error stringifying object:", error);
		return "";
	}
}

function safeParse(str: string): any {
	try {
		return JSON.parse(str);
	} catch (error) {
		console.error("Error parsing JSON:", error);
		return null;
	}
}

export function useJobDraft() {
	const [draft, setDraft] = useState<JobDraft | null>(null);
	const [isLoaded, setIsLoaded] = useState(false);
	const lastSavedRef = useRef<string>("");
	const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	// Load draft from localStorage on mount
	useEffect(() => {
		try {
			const savedDraft = localStorage.getItem(DRAFT_KEY);
			if (savedDraft) {
				const parsed = safeParse(savedDraft);
				if (parsed) {
					// Normalize fields for the form
					const normalizedDraft: JobDraft = {
						title: parsed.title || "",
						summary: blocksToString(
							parsed.summary,
						),
						location: parsed.location || "",
						jobType: parsed.jobType || "",
						education:
							parsed.education || "",
						jobField: parsed.jobField || "",
						level: parsed.level || "",
						deadline: parsed.deadline || "",
						salaryRange: {
							min:
								parsed
									.salaryRange
									?.min ||
								0,
							max:
								parsed
									.salaryRange
									?.max ||
								0,
						},
						requirements: arrayToString(
							parsed.requirements,
						),
						responsibilities: arrayToString(
							parsed.responsibilities,
						),
						recruitmentProcess:
							arrayToString(
								parsed.recruitmentProcess,
							),
						apply: blocksToString(
							parsed.apply,
						),
					};

					setDraft(normalizedDraft);
					lastSavedRef.current = savedDraft;
				}
			}
		} catch (error) {
			console.error("Error loading draft:", error);
			// Clear corrupted draft
			localStorage.removeItem(DRAFT_KEY);
		} finally {
			setIsLoaded(true);
		}
	}, []);

	const saveDraft = useCallback(
		(data: any) => {
			// Prevent saving if not loaded yet
			if (!isLoaded) {
				console.log(
					"Draft not loaded yet, skipping save",
				);
				return;
			}

			// Clear any existing timeout
			if (saveTimeoutRef.current) {
				clearTimeout(saveTimeoutRef.current);
			}

			// Debounce the save operation
			saveTimeoutRef.current = setTimeout(() => {
				try {
					// Ensure we have valid data
					if (!data || typeof data !== "object") {
						console.log(
							"Invalid data for draft save:",
							data,
						);
						return;
					}

					const newDraft: JobDraft = {
						title: String(data.title || ""),
						summary: String(
							data.summary || "",
						),
						location: String(
							data.location || "",
						),
						jobType: String(
							data.jobType || "",
						),
						education: String(
							data.education || "",
						),
						jobField: String(
							data.jobField || "",
						),
						level: String(data.level || ""),
						deadline: String(
							data.deadline || "",
						),
						salaryRange: {
							min:
								Number(
									data
										.salaryRange
										?.min,
								) || 0,
							max:
								Number(
									data
										.salaryRange
										?.max,
								) || 0,
						},
						requirements: String(
							data.requirements || "",
						),
						responsibilities: String(
							data.responsibilities ||
								"",
						),
						recruitmentProcess: String(
							data.recruitmentProcess ||
								"",
						),
						apply: String(data.apply || ""),
					};

					const serializedDraft =
						safeStringify(newDraft);

					// Only save if the draft has actually changed and is valid
					if (
						serializedDraft &&
						serializedDraft !==
							lastSavedRef.current
					) {
						console.log(
							"💾 Saving draft to localStorage",
						);
						setDraft(newDraft);
						localStorage.setItem(
							DRAFT_KEY,
							serializedDraft,
						);
						lastSavedRef.current =
							serializedDraft;
					}
				} catch (error) {
					console.error(
						"Error saving draft:",
						error,
					);
				}
			}, 100); // Small delay to batch rapid changes
		},
		[isLoaded],
	);

	const clearDraft = useCallback(() => {
		try {
			localStorage.removeItem(DRAFT_KEY);
			setDraft(null);
			lastSavedRef.current = "";

			// Clear any pending save operations
			if (saveTimeoutRef.current) {
				clearTimeout(saveTimeoutRef.current);
				saveTimeoutRef.current = null;
			}

			console.log("Draft cleared successfully");
		} catch (error) {
			console.error("Error clearing draft:", error);
		}
	}, []);

	// Cleanup timeout on unmount
	useEffect(() => {
		return () => {
			if (saveTimeoutRef.current) {
				clearTimeout(saveTimeoutRef.current);
			}
		};
	}, []);

	return { draft, saveDraft, clearDraft, isLoaded };
}
