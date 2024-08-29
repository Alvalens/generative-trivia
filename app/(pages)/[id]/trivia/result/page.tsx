"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";

const updateLeaderboard = async (score: number, quizCount: number) => {
    try {
        const response = await fetch("/api/leaderboard", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ score, quizCount }),
        });

        const data = await response.json();
        if (data.success) {
            console.log("Leaderboard updated successfully.");
        } else {
            console.error("Failed to update leaderboard:", data.message);
        }
    } catch (error) {
        console.error("Error updating leaderboard:", error);
    }
};

export default function ResultPage() {
    const router = useRouter();
    const [score, setScore] = useState<number | null>(null);
    const [triviaID, setTriviaID] = useState<number | null>(null);
    const [quizCount, setQuizCount] = useState<number | null>(null);

    useEffect(() => {
        const pathSegments = window.location.pathname.split("/");
        const id = Number(pathSegments[1]);
        setTriviaID(id);

        const storedTrivia = localStorage.getItem("triviaQuestions");
        if (storedTrivia) {
            const triviaList = JSON.parse(storedTrivia);
            const triviaItem = triviaList.find((item: { id: number }) => item.id === id);
            if (triviaItem) {
                setScore(triviaItem.score || 0); 
                setQuizCount(triviaItem.trivia.length);
            }
        }
    }, []);

    useEffect(() => {
        if (triviaID) {
            updateLeaderboard(score || 0, quizCount || 0);
        }
    }, [triviaID, score, quizCount]);

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
