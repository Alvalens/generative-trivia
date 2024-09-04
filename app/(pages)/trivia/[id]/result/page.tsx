"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const updateLeaderboard = async (score: number, quizCount: number, triviaID: number) => {
    try {
        const response = await fetch("/api/leaderboard", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ score, quizCount, triviaID }),
        });

        const data = await response.json();
        // Handle response accordingly
    } catch (error) {
        console.error("Error updating leaderboard:", error);
    }
};

export default function ResultPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [score, setScore] = useState<number | null>(null);
    const [triviaID, setTriviaID] = useState<number | null>(null);
    const [quizCount, setQuizCount] = useState<number | null>(null);
    const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);

    useEffect(() => {
        const id = Number(params.id);
        setTriviaID(id);

        const storedTrivia = localStorage.getItem("triviaQuestions");
        if (storedTrivia) {
            const triviaList = JSON.parse(storedTrivia);
            const triviaItem = triviaList.find((item: { id: number }) => item.id === id);
            if (triviaItem) {
                setScore(triviaItem.score || 0);
                setQuizCount(triviaItem.trivia.length);
            }

            // Check if score has been submitted already
            const submittedScores = localStorage.getItem("submittedScores") || "{}";
            const submittedScoresObj = JSON.parse(submittedScores);
            if (submittedScoresObj[id]) {
                setHasSubmitted(true);
            }
        }
    }, [params.id]);

    useEffect(() => {
        if (triviaID && !hasSubmitted) {
            updateLeaderboard(score || 0, quizCount || 0, triviaID);
            // Mark as submitted
            const submittedScores = localStorage.getItem("submittedScores") || "{}";
            const submittedScoresObj = JSON.parse(submittedScores);
            submittedScoresObj[triviaID] = true;
            localStorage.setItem("submittedScores", JSON.stringify(submittedScoresObj));
        }
    }, [triviaID, score, quizCount, hasSubmitted]);

    const handleBackToHome = () => {
        router.push("/");
    };

    return (
        <div className="p-4 h-screen flex flex-col justify-center items-center">
            <h2 className="text-xl font-bold mb-4">Your Score</h2>
            <p className="text-2xl font-semibold mb-4">
                {score !== null ? `${score * (quizCount != null ? quizCount : 0)}` : "Loading..."}
            </p>
            <small className="text-sm text-gray-500">
                You got {score} out of {quizCount} questions right.
            </small>
            <small className="text-sm text-gray-500"> {score} x {quizCount}</small>
            <Button onClick={handleBackToHome} className="mt-4">
                Back to Home
            </Button>
        </div>
    );
}
