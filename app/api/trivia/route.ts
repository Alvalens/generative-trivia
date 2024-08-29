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
		const { educationLevel, subject, questionCount, language } =
			await request.json();

		// Initialize the Google Generative AI client
		const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
		const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

		// Construct the prompt dynamically based on input
		const educationLevelText = educationLevels[language][educationLevel];
		const prompt = `
      Generate ${questionCount} trivia questions about ${subject} for a student at the ${educationLevelText} level.
      ${
			language === "indonesian"
				? "Ensure the questions adhere to the Indonesian curriculum."
				: ""
		}
      Format the output as an array with no additional styling, e.g., [{question: 'example question', answer: 'example answer'}].
      Ensure each question is short-answer, with a maximum of 4 words the answer should not multiple answer it should be single answer.
      Ensure each trivia question is unique.
      Tailor the trivia to suit the student's curriculum in ${language}.
    `.trim();

		const response = await model.generateContent(prompt);

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
