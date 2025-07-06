import { useEffect, useState, useCallback, useRef } from "react";

const DRAFT_KEY = "job_post_draft";

export interface JobDraft {
	title: string;
	summary: string; // Form accepts string, we transform to blocks
	location: string; // Form accepts string, we transform to reference
	jobType: string;
	education: string;
	jobField: string;
	level: string;
	deadline?: string;
	salaryRange: {
		min: number;
		max: number;
	};
	requirements: string; // Form accepts string, we transform to array
	responsibilities: string;
	recruitmentProcess: string;
	apply: string; // Form accepts string, we transform to blocks
}

export function useJobDraft() {
	const [draft, setDraft] = useState<JobDraft | null>(null);
	const [isLoaded, setIsLoaded] = useState(false);
	const lastSavedRef = useRef<string>("");

	// Load draft from localStorage on mount
	useEffect(() => {
		const savedDraft = localStorage.getItem(DRAFT_KEY);
		if (savedDraft) {
			try {
				const parsed = JSON.parse(savedDraft);
				// Only load if draft is less than 24 hours old
				if (
					Date.now() - parsed.lastUpdated <
					24 * 60 * 60 * 1000
				) {
					setDraft(parsed);
					lastSavedRef.current = savedDraft;
				} else {
					localStorage.removeItem(DRAFT_KEY);
				}
			} catch (error) {
				console.error("Error loading draft:", error);
			}
		}
		setIsLoaded(true);
	}, []);

	const saveDraft = useCallback(
		(data: any) => {
			// Prevent saving if not loaded yet or if data hasn't changed
			if (!isLoaded) return;

			const newDraft: JobDraft = {
				title: data.title || "",
				summary: data.summary || [],
				location: data.location || { _ref: "" },
				jobType: data.jobType || { _ref: "" },
				education: data.education || { _ref: "" },
				jobField: data.jobField || { _ref: "" },
				level: data.level || { _ref: "" },
				deadline: data.deadline || "",
				salaryRange: {
					min: data.salaryRange?.min || 0,
					max: data.salaryRange?.max || 0,
				},
				requirements: data.requirements || [],
				responsibilities: data.responsibilities || [],
				recruitmentProcess:
					data.recruitmentProcess || [],
				apply: data.apply || [],
			};

			const serializedDraft = JSON.stringify(newDraft);

			// Only save if the draft has actually changed
			if (serializedDraft !== lastSavedRef.current) {
				setDraft(newDraft);
				localStorage.setItem(
					DRAFT_KEY,
					serializedDraft,
				);
				lastSavedRef.current = serializedDraft;
			}
		},
		[isLoaded],
	);

	const clearDraft = useCallback(() => {
		localStorage.removeItem(DRAFT_KEY);
		setDraft(null);
		lastSavedRef.current = "";
	}, []);

	return { draft, saveDraft, clearDraft, isLoaded };
}
