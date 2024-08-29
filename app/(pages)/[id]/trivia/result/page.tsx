"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function ResultPage() {
    const router = useRouter();
    const [score, setScore] = useState<number | null>(null);
    const [triviaID, setTriviaID] = useState<number | null>(null);

    useEffect(() => {
        // Retrieve the trivia ID from the URL
        const pathSegments = window.location.pathname.split("/");
        const id = Number(pathSegments[1]);
        setTriviaID(id);

        // Fetch the trivia data from localStorage
        const storedTrivia = localStorage.getItem("triviaQuestions");
        if (storedTrivia) {
            const triviaList = JSON.parse(storedTrivia);
            const triviaItem = triviaList.find((item: { id: number }) => item.id === id);
            if (triviaItem) {
                setScore(triviaItem.score || 0); // Set the score from localStorage
            }
        }
    }, []);

    const handleBackToHome = () => {
        router.push("/");
    };

    return (
        <div className="p-4 h-screen flex flex-col justify-center items-center">
            <h2 className="text-xl font-bold mb-4">Your Score</h2>
            <p className="text-2xl font-semibold">{score !== null ? `Score: ${score}` : "Loading..."}</p>
            <Button onClick={handleBackToHome} className="mt-4">
                Back to Home
            </Button>
        </div>
    );
}
