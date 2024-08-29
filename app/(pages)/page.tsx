"use client";
import { Button } from "@/components/ui/button";
import { Fragment } from "react";
import { useSession } from "next-auth/react";
import CardHero from "./components/guest"; 
import Form from "./components/form";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  const { data: session } = useSession();

  return (
    <Fragment>
      <div className="flex flex-col items-center justify-center h-screen container">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
          <div className="space-y-4 flex flex-col justify-center">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Unleash Your Knowledge with Generative Trivia
            </h1>
            <p className="max-w-[600px] text-muted-foreground md:text-xl">
              Explore a personalized trivia experience tailored to your education level, interests, and language
              preferences.
            </p>
          </div>
          <Card className="bg-background rounded-lg p-6 shadow-lg dark:shadow-white/30">
            <CardContent className="space-y-4">
              {session ? (
                <Form />
              ) : (
                <CardHero />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Fragment>
  );
}
