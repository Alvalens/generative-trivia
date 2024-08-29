export { default } from "next-auth/middleware";

export const config = {
	matcher: [
		"/((?!^$).*)", // Protect all routes except "/"
	],
};
