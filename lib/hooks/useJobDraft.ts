import { useEffect, useState } from "react";

const DRAFT_KEY = "job_post_draft";

export interface JobDraft {
	title: string;
	summary: any[];
	location: { _ref: string };
	jobType: { _ref: string };
	education: { _ref: string };
	jobField: { _ref: string };
	level: { _ref: string };
	deadline?: string;
	salaryRange: {
		min: number;
		max: number;
	};
	requirements: string[];
	responsibilities?: string[];
	recruitmentProcess?: string[];
	apply: any[];
	lastUpdated?: number;
}

export function useJobDraft() {
	const [draft, setDraft] = useState<JobDraft | null>(null);

	// Load draft on mount
	useEffect(() => {
		const savedDraft = localStorage.getItem(DRAFT_KEY);
		if (savedDraft) {
			try {
				const parsed = JSON.parse(savedDraft);
				// Only load draft if it's less than 24 hours old
				if (
					Date.now() - parsed.lastUpdated <
					24 * 60 * 60 * 1000
				) {
					setDraft(parsed);
				} else {
					localStorage.removeItem(DRAFT_KEY);
				}
			} catch (error) {
				console.error("Error loading draft:", error);
			}
		}
	}, []);

	const saveDraft = (data: Partial<JobDraft>) => {
		const newDraft = {
			...draft,
			...data,
			lastUpdated: Date.now(),
		};
		setDraft(newDraft);
		localStorage.setItem(DRAFT_KEY, JSON.stringify(newDraft));
	};

	const clearDraft = () => {
		localStorage.removeItem(DRAFT_KEY);
		setDraft(null);
	};

	return { draft, saveDraft, clearDraft };
}
