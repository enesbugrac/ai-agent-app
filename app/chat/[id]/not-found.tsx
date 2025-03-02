import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-background">
      <h2 className="text-2xl font-medium text-primary mb-4">Agent Not Found</h2>
      <p className="text-secondary mb-8">The agent you're looking for doesn't exist.</p>
      <Link 
        href="/special-agents" 
        className="flex items-center gap-2 text-primary hover:text-primary/80"
      >
        <FaArrowLeft className="text-sm" />
        <span>Back to Agents</span>
      </Link>
    </div>
  );
} 