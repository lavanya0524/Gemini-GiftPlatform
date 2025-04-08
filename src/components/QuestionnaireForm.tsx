import React, { useState } from "react";
import { Send } from "lucide-react";
import type { Recipient, GiftSuggestion } from "../types";
import { generateGiftSuggestions } from "../services/gemini";
import GiftSuggestions from "./GiftSuggestions";

interface QuestionnaireFormProps {
  onSubmit: (data: GiftSuggestion[]) => void;
}

const OCCASIONS = ["Birthday", "Anniversary", "Wedding", "Graduation", "Christmas", "Housewarming", "Baby Shower", "Other"];
const RELATIONSHIPS = ["Family", "Friend", "Colleague", "Partner", "Acquaintance", "Other"];

export default function QuestionnaireForm({ onSubmit }: QuestionnaireFormProps) {
  const [formData, setFormData] = useState<Recipient>({
    name: "",
    age: 0,
    occasion: "",
    interests: [],
    budget: 0,
    relationship: "",
  });

  const [suggestions, setSuggestions] = useState<GiftSuggestion[]>([]);
  const [currentInterest, setCurrentInterest] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const generatedSuggestions = await generateGiftSuggestions(formData);
      setSuggestions(generatedSuggestions);
      onSubmit(generatedSuggestions);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addInterest = () => {
    if (currentInterest.trim() && !formData.interests.includes(currentInterest.trim())) {
      setFormData((prev) => ({ ...prev, interests: [...prev.interests, currentInterest.trim()] }));
      setCurrentInterest("");
    }
  };

  const removeInterest = (interest: string) => {
    setFormData((prev) => ({ ...prev, interests: prev.interests.filter((i) => i !== interest) }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-green-100 via-white to-blue-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[700px] w-full mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-teal-700 mb-8">
          🎁 Find the Perfect Gift
        </h2>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg px-5 py-6 sm:p-8 space-y-6 w-full">
          <div>
            <label className="block font-medium text-teal-800 mb-1">Recipient's Name</label>
            <input
              type="text"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-300"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-teal-800 mb-1">Age</label>
              <input
                type="number"
                required
                min="0"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-300"
                value={formData.age || ""}
                onChange={(e) => setFormData((prev) => ({ ...prev, age: parseInt(e.target.value) || 0 }))}
              />
            </div>
            <div>
              <label className="block font-medium text-teal-800 mb-1">Budget (₹ INR)</label>
              <input
                type="number"
                required
                min="0"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-300"
                value={formData.budget || ""}
                onChange={(e) => setFormData((prev) => ({ ...prev, budget: parseInt(e.target.value) || 0 }))}
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-teal-800 mb-1">Occasion</label>
            <select
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-300"
              value={formData.occasion}
              onChange={(e) => setFormData((prev) => ({ ...prev, occasion: e.target.value }))}
            >
              <option value="">Select an occasion</option>
              {OCCASIONS.map((occasion) => (
                <option key={occasion} value={occasion}>{occasion}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium text-teal-800 mb-1">Relationship</label>
            <select
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-300"
              value={formData.relationship}
              onChange={(e) => setFormData((prev) => ({ ...prev, relationship: e.target.value }))}
            >
              <option value="">Select relationship</option>
              {RELATIONSHIPS.map((relationship) => (
                <option key={relationship} value={relationship}>{relationship}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium text-teal-800 mb-1">Interests</label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-300"
                value={currentInterest}
                onChange={(e) => setCurrentInterest(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addInterest())}
              />
              <button
                type="button"
                onClick={addInterest}
                className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg transition"
              >
                Add
              </button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {formData.interests.map((interest) => (
                <span key={interest} className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full flex items-center gap-2">
                  {interest}
                  <button
                    type="button"
                    onClick={() => removeInterest(interest)}
                    className="text-red-600 hover:text-red-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="text-center pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 mx-auto transition-all duration-200"
            >
              {isLoading ? "Generating..." : <>
                <Send className="w-5 h-5" /> Get Suggestions
              </>}
            </button>
          </div>
        </form>

        <GiftSuggestions suggestions={suggestions} isLoading={isLoading} />

        <footer className="text-center text-teal-700 text-sm mt-10">
          All rights reserved to Lavanya © 2025
        </footer>
      </div>
    </div>
  );
}
