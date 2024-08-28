"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { Fragment } from "react";
import Image from "next/image";

export default function SignIn() {
    const session = useSession();
    function handleSignIn() {
        try {
            signIn("google", { callbackUrl: "/" });
        } catch (error) {
            console.error("Failed to sign in", error);
        }
    }
    if (!session || session.status === "unauthenticated") {
        return (
            <div>
                <h1>Sign In</h1>
                <button onClick={handleSignIn}>
                    Sign in with Google
                </button>
            </div>
        );
    }

    return (
        <Fragment>
            <main className='flex min-h-screen flex-col items-center justify-center p-24'>
                <span className='text-lg font-bold'>Hello {session?.data?.user?.name}</span>
                <Image src={session?.data?.user?.image ?? ""} alt={session?.data?.user?.name ?? ""} className=' my-2 rounded-full' width={200} height={200} />
                <button className='btn bg-red-500 text-black font-medium text-lg p-4 rounded mt-2' onClick={() => signOut()}>
                    Logout
                </button>
            </main>
        </Fragment>
    );
};

