import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { FirestoreAdapter } from "@next-auth/firebase-adapter";
import { AuthOptions } from "next-auth";
import { cert } from "firebase-admin/app";
import { firestore } from "@/lib/firebase";

export const authOptions: AuthOptions = {
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		}),
	],
	adapter: FirestoreAdapter({
		credentials: cert({
			projectId: process.env.FIREBASE_PROJECT_ID,
			clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
			privateKey: process.env.FIREBASE_PRIVATE_KEY
				? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/gm, "\n")
				: undefined,
		}),
	}),
	pages: {
		signIn: "/auth/login",
	},
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
