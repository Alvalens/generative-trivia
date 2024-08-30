"use client";
import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Award, Medal, Star } from "lucide-react";
import useSWR from "swr";

interface LeaderboardEntry {
  name: string;
  avatar: string;
  score: number;
  quizCount: number;
}

const fetcher = async (url: string) => {
  const session = await getSession();

  if (!session) {
    throw new Error("Not authenticated");
  }

  const res = await fetch(url, {
    method: "GET",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
};

const Leaderboard = () => {
  const { data, error, isLoading } = useSWR("/api/leaderboard", fetcher, {
    revalidateOnFocus: false, 
    revalidateOnReconnect: true,
    refreshInterval: 30000,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 min-h-screen flex flex-col justify-center items-center text-gray-900 dark:text-gray-100">
        <p className="text-xl font-semibold">Loading...</p>
      </div>
    );
  }

  if (error || !data?.success) {
    return (
      <div className="container mx-auto p-4 min-h-screen flex flex-col justify-center items-center text-gray-900 dark:text-gray-100">
        <p className="text-xl font-semibold">Failed to load leaderboard</p>
      </div>
    );
  }

  const { leaderboard, user } = data;

  return (
    <div className="container mx-auto p-4 min-h-screen flex flex-col justify-center text-gray-900 dark:text-gray-100 mt-20">
      <h1 className="text-3xl font-bold mb-4 text-center">Leaderboard</h1>
      <div className="grid grid-cols-1 gap-4">
        {leaderboard.map((entry: LeaderboardEntry, index: number) => (
          <Card key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded shadow-lg dark:bg-gray-800">
            <div className="flex items-center space-x-4">
              <Avatar className="w-10 h-10 rounded-full">
                <AvatarImage src={entry.avatar} alt={`${entry.name}'s avatar`} />
                <AvatarFallback>{entry.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold">{entry.name}</h3>
                <p className="text-sm text-gray-400">Score: {entry.score} | Quiz Completed: {entry.quizCount}</p>
              </div>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold">{index + 1}</p>
              {index === 0 && <Award className="text-yellow-500" size={24} />}
              {index === 1 && <Medal className="text-gray-400" size={24} />}
              {index === 2 && <Star className="text-bronze-500" size={24} />}
            </div>
          </Card>
        ))}
      </div>

      {user && (
        <div className="mb-8 p-4 bg-gray-100 rounded shadow-lg mt-8 dark:bg-gray-700">
          <h2 className="text-xl font-semibold">Your Stat</h2>
          <div className="flex items-center space-x-4 mt-2">
            <Avatar className="w-12 h-12 rounded-full">
              <AvatarImage src={user.avatar} alt={`${user.name}'s avatar`} />
              <AvatarFallback>{user.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg">{user.name}</h3>
              <p className="text-sm text-gray-400">
                Score: {user.score} | Quiz Completed: {user.quizCount}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
