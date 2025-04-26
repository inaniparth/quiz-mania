import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function getPerformanceFeedback(score: number, totalQuestions: number): string {
    const percentage = (score / totalQuestions) * 100;

    if (percentage >= 90) {
        return "Outstanding! You have excellent knowledge in this area. Keep up the great work!";
    } else if (percentage >= 70) {
        return "Good job! You've demonstrated a solid understanding. Review the concepts you missed and try again to improve your score.";
    } else if (percentage >= 50) {
        return "Not bad! You've got the basics down but there's room for improvement. Study the topics covered and try again.";
    } else {
        return "Keep learning! You may need to spend more time studying this topic. Don't give up and try again after reviewing the concepts.";
    }
}