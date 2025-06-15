import { toast } from "sonner";

export const showToast = {
	success: (message: string) => {
		toast.success(message);
	},
	error: (message: string) => {
		toast.error(message);
	},
	warning: (message: string) => {
		toast.warning(message);
	},
	info: (message: string) => {
		toast.info(message);
	},
	loading: (message: string) => {
		return toast.loading(message);
	},
	promise: async (
		promise: Promise<any>,
		options: {
			loading: string;
			success: string;
			error: string;
		},
	) => {
		return toast.promise(promise, options);
	},
};
