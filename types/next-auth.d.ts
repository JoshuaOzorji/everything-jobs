import { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";
import { AdapterUser } from "@auth/mongodb-adapter";

declare module "next-auth" {
	interface Session {
		user: {
			id: string;
			role: string;
			companyId?: string;
		} & DefaultSession["user"];
	}

	interface User extends AdapterUser {
		role: string;
		companyId?: string;
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		role: string;
		companyId?: string;
	}
}

declare module "@auth/mongodb-adapter" {
	interface AdapterUser extends DefaultUser {
		role: string;
		companyId?: string;
	}
}
