interface FormatDate2 {
	(date: Date): string;
}

export const formatDate2: FormatDate2 = (date) => {
	const day = date.getDate();
	const month = date.toLocaleString("en-US", { month: "short" });
	const year = date.getFullYear();

	return `${day}-${month}-${year}`;
};
