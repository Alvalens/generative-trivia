"use client";
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
type Props = {
	children: React.ReactNode;
	session: Session | null;
}
const NextAuthProvider = ({ children, session }: Props) => {
	return <SessionProvider session={session}>{children}</SessionProvider>;
};

export default NextAuthProvider;
