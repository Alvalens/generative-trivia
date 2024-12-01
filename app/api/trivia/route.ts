import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Education levels mapped for both English and Indonesian
const educationLevels: { [key: string]: { [key: number]: string } } = {
	english: {
		1: "Elementary",
		2: "Middle School",
		3: "High School",
		4: "College",
	},
	indonesian: {
		1: "Sekolah Dasar",
		2: "Sekolah Menengah Pertama",
		3: "Sekolah Menengah Atas",
		4: "Kuliah",
	},
};

export const POST = async (request: Request) => {
	try {
		// Ensure the user is logged in
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
		
		// Extract parameters from the request body
		const { educationLevel, subject, questionCount, language } = await request.json();
		
		const educationLevelText = educationLevels[language][educationLevel];

		const timestamp = Date.now();
		const randomSeed = Math.random().toString(36).substring(7);
		const difficultyDistribution = ["easy", "medium", "hard"].join(",");
		const questionTypes = [
			"factual",
			"conceptual",
			"analytical",
			"application",
		].join(",");

		const prompt = `
		Generate ${questionCount} unique trivia questions about ${subject} for a ${educationLevelText} level with the following specifications:

		1. Randomization Seed: ${randomSeed}
		2. Timestamp: ${timestamp}
		3. Question Types: Rotate through [${questionTypes}]
		4. Difficulty Distribution: [${difficultyDistribution}] (40% hard, 35% medium, 25% easy)
		5. Question Constraints: Ensure only generate short answered question, avoid explanation question like "explain why, how, jelaskan mengapa, bagaimana, etc"
		6. Answer Constraints: Maximum 2 short words per answer
		7. Language: ${
			language === "indonesian"
				? "Indonesian curriculum-aligned"
				: "Standard international"
		}

		Requirements:
		- Ensure questions are distinct within this session
		- Vary question patterns for each generation
		- Include subject-specific terminology
		- Focus on core curriculum concepts
		- Adapt difficulty based on education level

		Format output as JSON array:
		[{question: "question text", answer: "answer text"}]

		Additional context:
		- Subject area: ${subject}
		- Education level: ${educationLevelText}
		- Session ID: ${randomSeed}-${timestamp}
		`.trim();

		const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
		const model = genAI.getGenerativeModel({ 
			model: "gemini-1.5-flash", 
			generationConfig: {
				temperature: 1.5,
			},
			systemInstruction: prompt });
        

		const response = await model.generateContent("");

		const triviaQuestions = response.response.text()
            

		return NextResponse.json({ success: true, triviaQuestions });
	} catch (error) {
		console.error("Error generating trivia:", error);

		// Return a failure response in case of an error
		return NextResponse.json(
			{ success: false, message: "Failed to generate trivia." },
			{ status: 500 }
		);
	}
};
