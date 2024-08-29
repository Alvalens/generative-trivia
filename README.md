# Alvalens Porto 2

![visitor badge](https://visitor-badge.laobi.icu/badge?page_id=generative-trivia.visitor-badge)

A generative trivia website built with Next.js, Firebase, NextAuth, Google OAuth, and TypeScript. Users can generate trivia questions for predefined school subjects and answer them with a unique interactive input style. The application supports user authentication with Google and stores data in Firestore.

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) ![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white) ![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white) ![Firebase](https://img.shields.io/badge/firebase-a08021?style=for-the-badge&logo=firebase&logoColor=ffcd34)

## Features

- **User Authentication**: Sign in with Google using NextAuth.
- **Firestore Integration**: Store and retrieve trivia questions and user data.
- **Dynamic Trivia Generation**: Generate trivia questions on predefined subjects.
- **Interactive Answer Input**: Multiple input fields per word with a unique OTP-style interface.
- **Protected Routes**: Ensure only authenticated users can access certain parts of the app.

## Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/Alvalens/generative-trivia.git
   cd generative-trivia
   ```
2. **Install dependencies**:

   ```bash
   pnpm install
   ```
3. **Set up Firebase**:

   - Go to the Firebase console, create a project, and enable Firestore.
   - Set up Google authentication in Firebase Authentication.
4. **Set up Google OAuth**:

   - Create OAuth credentials in the Google Cloud Console.
   - Obtain `CLIENT_ID` and `CLIENT_SECRET`.

5. **Set up Gemini API**:
   Create Gemini API credentials in the Google AI Studio.

## Contributing

Contributions are welcome! If you find any issues or have suggestions, feel free to open an issue or submit a pull request.


## License

This project is licensed under the GPL-3.0 License see the [LICENSE](LICENSE) file for details.

## Key Points to Customize:
- Replace `yourusername` with your GitHub username if applicable.
- Add any additional setup or usage instructions specific to your project.
- Update or fill any blank envirotment variable

This `README.md` should give anyone a clear understanding of how to set up, use, and contribute to your project.