"use client";

import { useState } from "react";
import { useWhitelistQuery } from "@/hooks/queries/whitelist.query";
import { ReactNode } from "react";
import SuccessMessage from "@/components/common/SuccessMessage";

interface WhitelistFormProps {
  description?: string;
  successContent?: ReactNode;
  existingEmailSuccessContent?: ReactNode;
}

const WhitelistForm: React.FC<WhitelistFormProps> = ({
  description = "Get early access to AIGEN and be the first to experience our AI-powered agents.", // Default description
  successContent,
  existingEmailSuccessContent,
}) => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isExistingEmail, setIsExistingEmail] = useState(false);

  const { addEmailToWhitelist } = useWhitelistQuery();
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email) {
      setError("Email is required");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await addEmailToWhitelist(email);
      if (response.status === "exists") {
        setIsExistingEmail(true);
        setSuccess(true);
        setEmail("");
      } else {
        setSuccess(true);
        setEmail("");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to join waitlist. Please try again.";
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      {success ? (
        <>
          {isExistingEmail ? (
            <>
              {existingEmailSuccessContent || (
                <SuccessMessage
                  title="You're already on the list!"
                  message="Thank you for joining. We'll notify you for the upcoming features."
                />
              )}
            </>
          ) : (
            <>
              {successContent || (
                <SuccessMessage
                  title="You're on the list!"
                  message="Thank you for joining. We'll notify you for the upcoming features."
                />
              )}
            </>
          )}
        </>
      ) : (
        <>
          <h3 className="text-white text-lg font-medium mb-2">Join the Waitlist</h3>
          <p className="text-secondary text-sm mb-6">
            {description} {/* Use description prop */}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-secondary mb-1"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full p-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-white text-sm"
                disabled={isSubmitting}
              />
              {error && <p className="mt-1 text-red-400 text-xs">{error}</p>}
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 rounded-lg text-black font-medium transition-all ${
                isSubmitting
                  ? "bg-primary/70 cursor-not-allowed"
                  : "bg-primary hover:bg-primary/90"
              }`}
            >
              {isSubmitting ? "Submitting..." : "Join Waitlist"}
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default WhitelistForm;
