import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { firestore as db } from "@/lib/firebase";
import { FieldValue } from "firebase-admin/firestore";

export const GET = async () => {
	const session = await getServerSession(authOptions as any);
	if (!session) {
		return NextResponse.json(
			{
				success: false,
				message: "Unauthorized. Please log in first.",
			},
			{ status: 401 }
		);
	}

	const userId = session.user.id;

	try {
		// Retrieve the current user's leaderboard data
		const userDocRef = db.collection("leaderboard").doc(userId);
		const userDoc = await userDocRef.get();
		const user = userDoc.data();

		// Retrieve the top 10 leaderboard entries ordered by score
		const leaderboardSnapshot = await db
			.collection("leaderboard")
			.orderBy("score", "desc")
			.limit(10)
			.get();

		const leaderboardData = leaderboardSnapshot.docs.map((doc) =>
			doc.data()
		);

        console.log("Leaderboard data:", leaderboardData);

		return NextResponse.json({
			success: true,
			user,
			leaderboard: leaderboardData,
		});
	} catch (error) {
		console.error("Error retrieving leaderboard data:", error);
		return NextResponse.json(
			{
				success: false,
				message: "Error retrieving leaderboard data.",
			},
			{ status: 500 }
		);
	}
};

export const POST = async (request: Request) => {
	const session = await getServerSession(authOptions as any);
	if (!session) {
		return NextResponse.json(
			{
				success: false,
				message: "Unauthorized. Please log in first.",
			},
			{ status: 401 }
		);
	}

	const userId = session.user.id;
	const { name, image } = session.user;
	const { score, quizCount } = await request.json();

	if (score === undefined || quizCount === undefined) {
		return NextResponse.json(
			{ success: false, message: "Missing parameters." },
			{ status: 400 }
		);
	}

	try {
		const userDocRef = db.collection("leaderboard").doc(userId);
		const userDoc = await userDocRef.get();

		const scoreIncrement = score * quizCount;

		if (userDoc.exists) {
			// Update existing user's score and other details
			await userDocRef.update({
				score: FieldValue.increment(scoreIncrement),
				quizCount: FieldValue.increment(quizCount),
				name,
				avatar: image,
			});
		} else {
			// Create new user entry in leaderboard
			await userDocRef.set({
				score: scoreIncrement,
				quizCount,
				name,
				avatar: image,
			});
		}

		return NextResponse.json({
			success: true,
			message: "Score updated successfully.",
		});
	} catch (error) {
		console.error("Error updating score:", error);
		return NextResponse.json(
			{ success: false, message: "Error updating score." },
			{ status: 500 }
		);
	}
};