import { Button } from "@/components/ui/button";
import googleIcon from "@/public/images/icons/google.png";
import Image from "next/image";
import { Fragment } from "react";
import { signIn } from "next-auth/react";
export default function CardHero() {
    return (
        <Fragment>
            <h3 className="text-2xl font-bold">Sign in with Google</h3>
            <div className="flex items-center justify-center my-5">
                <Image
                    src={googleIcon}
                    alt="Google Logo"
                    width={40}
                    height={40}
                    className="mr-4"
                    style={{ aspectRatio: "40/40", objectFit: "cover" }}
                />
                <p className="text-muted-foreground">
                    Sign in with your Google account to access the Trivia Challenge.
                </p>
            </div>
            <Button variant="outline" className="w-full" onClick={() => signIn("google")}>
                Sign in with Google
            </Button>
        </Fragment>
    );
}
