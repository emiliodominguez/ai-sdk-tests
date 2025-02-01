import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "@/styles/main.scss";

const geistSans = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "AI SDK",
	description: "A simple AI chatbot using Vercel's AI SDK",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="en">
			<body className={geistSans.className}>{children}</body>
		</html>
	);
}
