import NextAuth from "next-auth";
import { authOptions } from "./config";

export const config = {
	api: {
		bodyParser: {
			sizeLimit: "1mb",
		},
		responseLimit: false,
	},
};
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
