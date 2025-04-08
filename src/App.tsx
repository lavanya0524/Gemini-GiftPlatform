import React, { useState } from "react";
import QuestionnaireForm from "./components/QuestionnaireForm";
import GiftSuggestions from "./components/GiftSuggestions";
import { generateGiftSuggestions } from "./services/gemini";
import type { Recipient, GiftSuggestion } from "./types";

function App() {
  const [suggestions, setSuggestions] = useState<GiftSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  const handleSubmit = async (recipient: Recipient) => {
    setIsLoading(true);
    setError(null);
    setInfoMessage(null);
    setSuggestions([]);

    try {
      const newSuggestions = await generateGiftSuggestions(recipient);
      console.log("🎁 Received Suggestions:", newSuggestions);

      if (!Array.isArray(newSuggestions) || newSuggestions.length === 0) {
        setInfoMessage(`✅ Successfully generated gifts!`);
        return;
      }

      setError("No suggestions available. Try again.");
    } catch (err) {
      setError("Failed to generate gift suggestions. Please try again.");
      console.error("❌ Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-gray-100 text-gray-900 font-sans">
      <div className="max-w-2xl w-full p-8 bg-white shadow-lg rounded-lg border border-gray-300">
        <div className="mt-6">
          <QuestionnaireForm onSubmit={handleSubmit} isLoading={isLoading} />
        </div>

        

        <div className="mt-6">
          <GiftSuggestions suggestions={suggestions} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}

export default App;
