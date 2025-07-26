import { useState, useCallback, useRef, useMemo } from "react";

const DRAFT_KEY = "job_post_draft";

export interface JobDraft {
	title: string;
	summary?: string;
	location: string;
	jobType: string;
	education: string;
	jobField: string;
	requirements: string;
	responsibilities: string;
	apply: string;
	level?: string;
	deadline?: string;
	salaryRange?: {
		min?: number;
		max?: number;
	};
	recruitmentProcess?: string;
}

function blocksToString(blocks: any[] | string): string {
	if (!blocks) return "";
	if (typeof blocks === "string") return blocks;
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

// Check if we're in a browser environment
const isBrowser = typeof window !== "undefined";

// Lightweight debounce utility
function createDebouncedFunction<T extends (...args: any[]) => void>(
	func: T,
	delay: number,
): (...args: Parameters<T>) => void {
	let timeoutId: NodeJS.Timeout | null = null;

	return (...args: Parameters<T>) => {
		if (timeoutId) {
			clearTimeout(timeoutId);
		}
		timeoutId = setTimeout(() => func(...args), delay);
	};
}

// Lazy loader function that only runs when actually needed
function loadDraftFromStorage(): JobDraft | null {
	if (!isBrowser) return null;

	try {
		const savedDraft = localStorage.getItem(DRAFT_KEY);
		if (!savedDraft) return null;

		const parsed = safeParse(savedDraft);
		if (!parsed) return null;

		// Normalize fields for the form
		const normalizedDraft: JobDraft = {
			title: parsed.title || "",
			summary: blocksToString(parsed.summary),
			location: parsed.location || "",
			jobType: parsed.jobType || "",
			education: parsed.education || "",
			jobField: parsed.jobField || "",
			level: parsed.level || "",
			deadline: parsed.deadline || "",
			salaryRange: {
				min: parsed.salaryRange?.min || 0,
				max: parsed.salaryRange?.max || 0,
			},
			requirements: arrayToString(parsed.requirements),
			responsibilities: arrayToString(
				parsed.responsibilities,
			),
			recruitmentProcess: arrayToString(
				parsed.recruitmentProcess,
			),
			apply: blocksToString(parsed.apply),
		};

		return normalizedDraft;
	} catch (error) {
		console.error("Error loading draft:", error);
		// Clear corrupted draft
		try {
			if (isBrowser) {
				localStorage.removeItem(DRAFT_KEY);
			}
		} catch (e) {
			console.error("Error clearing corrupted draft:", e);
		}
		return null;
	}
}

export function useJobDraft() {
	// Use lazy initialization function in useState
	const [draft, setDraft] = useState<JobDraft | null>(() => {
		// This only runs once during initialization
		if (!isBrowser) return null;
		return loadDraftFromStorage();
	});

	const lastSavedRef = useRef<string>("");
	const isInitializedRef = useRef(false);

	// Initialize lastSavedRef if we have a draft
	if (!isInitializedRef.current && draft) {
		lastSavedRef.current = safeStringify(draft);
		isInitializedRef.current = true;
	}

	// Create a stable debounced save function
	const debouncedSave = useMemo(() => {
		return createDebouncedFunction((data: any) => {
			if (!isBrowser) return;

			try {
				// Ensure we have valid data
				if (!data || typeof data !== "object") {
					return;
				}

				const newDraft: JobDraft = {
					title: String(data.title || ""),
					summary: String(data.summary || ""),
					location: String(data.location || ""),
					jobType: String(data.jobType || ""),
					education: String(data.education || ""),
					jobField: String(data.jobField || ""),
					level: String(data.level || ""),
					deadline: String(data.deadline || ""),
					salaryRange: {
						min:
							Number(
								data.salaryRange
									?.min,
							) || 0,
						max:
							Number(
								data.salaryRange
									?.max,
							) || 0,
					},
					requirements: String(
						data.requirements || "",
					),
					responsibilities: String(
						data.responsibilities || "",
					),
					recruitmentProcess: String(
						data.recruitmentProcess || "",
					),
					apply: String(data.apply || ""),
				};

				const serializedDraft = safeStringify(newDraft);

				// Only save if the draft has actually changed and is valid
				if (
					serializedDraft &&
					serializedDraft !== lastSavedRef.current
				) {
					localStorage.setItem(
						DRAFT_KEY,
						serializedDraft,
					);
					setDraft(newDraft);
					lastSavedRef.current = serializedDraft;
					console.log(
						"💾 Draft saved successfully",
					);
				}
			} catch (error) {
				console.error("Error saving draft:", error);
			}
		}, 500);
	}, []);

	const saveDraft = useCallback(
		(data: any) => {
			debouncedSave(data);
		},
		[debouncedSave],
	);

	const clearDraft = useCallback(() => {
		if (!isBrowser) return;

		try {
			localStorage.removeItem(DRAFT_KEY);
			setDraft(null);
			lastSavedRef.current = "";
			console.log("🗑️ Draft cleared successfully");
		} catch (error) {
			console.error("Error clearing draft:", error);
		}
	}, []);

	// Immediate save for critical moments (like page unload)
	const saveImmediately = useCallback((data: any) => {
		if (!isBrowser) return;

		try {
			if (!data || typeof data !== "object") return;

			const newDraft: JobDraft = {
				title: String(data.title || ""),
				summary: String(data.summary || ""),
				location: String(data.location || ""),
				jobType: String(data.jobType || ""),
				education: String(data.education || ""),
				jobField: String(data.jobField || ""),
				level: String(data.level || ""),
				deadline: String(data.deadline || ""),
				salaryRange: {
					min: Number(data.salaryRange?.min) || 0,
					max: Number(data.salaryRange?.max) || 0,
				},
				requirements: String(data.requirements || ""),
				responsibilities: String(
					data.responsibilities || "",
				),
				recruitmentProcess: String(
					data.recruitmentProcess || "",
				),
				apply: String(data.apply || ""),
			};

			const serializedDraft = safeStringify(newDraft);
			if (
				serializedDraft &&
				serializedDraft !== lastSavedRef.current
			) {
				localStorage.setItem(
					DRAFT_KEY,
					serializedDraft,
				);
				lastSavedRef.current = serializedDraft;
				console.log("⚡ Draft saved immediately");
			}
		} catch (error) {
			console.error("Error saving draft immediately:", error);
		}
	}, []);

	return {
		draft,
		saveDraft,
		clearDraft,
		saveImmediately,
		isLoaded: true, // Always loaded since we use lazy initialization in useState
	};
}
