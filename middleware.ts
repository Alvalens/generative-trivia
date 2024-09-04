export { default } from "next-auth/middleware";

export const config = {
	matcher: [
		"/about",
		"/leaderboard",
		"/trivia/:path*",
	],
};
