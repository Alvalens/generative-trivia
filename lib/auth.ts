import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { FirestoreAdapter } from "@next-auth/firebase-adapter";
import { firestore } from "@/lib/firebase"; // Ensure this correctly initializes Firestore

export const authOptions = {
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		}),
		GitHubProvider({
			clientId: process.env.GITHUB_CLIENT_ID!,
			clientSecret: process.env.GITHUB_CLIENT_SECRET!,
		}),
	],
	adapter: FirestoreAdapter(firestore),
	session: {
		strategy: "jwt",
	},
	callbacks: {
		async session({ session, token }: { session: any; token: any }) {
			session.user.id = token.sub;
			return session;
		},
		async jwt({ token, user }: { token: any; user: any }) {
			if (user) {
				token.sub = user.id;
			}
			return token;
		},
	},
};

export default NextAuth(authOptions as any);
