import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
	function middleware(req) {
		const token = req.nextauth.token;
		const isAuth = !!token;

		const isAuthPage =
			req.nextUrl.pathname === "/auth/login" ||
			req.nextUrl.pathname === "/auth/signup" ||
			req.nextUrl.pathname === "/auth/error";

		if (isAuthPage) {
			if (isAuth) {
				return NextResponse.redirect(
					new URL("/dashboard", req.url),
				);
			}

			return NextResponse.next();
		}

		if (!isAuth) {
			return NextResponse.redirect(
				new URL("/auth/login", req.url),
			);
		}
	},
	{
		callbacks: {
			authorized: ({ token }) => !!token,
		},
	},
);

export const config = {
	matcher: ["/dashboard/:path*", "/post-job/:path*"],
};
