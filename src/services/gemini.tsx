import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  console.error("⚠️ Missing API Key. Ensure VITE_GEMINI_API_KEY is set.");
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const isValidFormData = (formData) => 
  formData?.occasion && formData?.relationship && formData?.interests?.length && formData?.budget;

export const generateGiftSuggestions = async (formData) => {
  if (!isValidFormData(formData)) {
    console.warn("⚠️ Skipping API call: Incomplete form data.", formData);
    return [];
  }

  const prompt = `Provide 5 unique gift ideas based on:
    Occasion: ${formData.occasion}
    Relationship: ${formData.relationship}
    Interests: ${formData.interests.join(", ")}
    Budget: $${formData.budget}

    Format the response as a JSON array of objects with:
    - title (string)
    - description (string)
    - reasoning (string)
    - estimatedPrice (string)

    Ensure the response is valid JSON with no extra text.`;

  try {
    
    const response = await model.generateContent({ contents: [{ parts: [{ text: prompt }] }] });

    const textResponse = await response?.response?.text();
    if (!textResponse) throw new Error("Empty response from API.");
    
    const jsonMatch = textResponse.match(/\[.*\]/s);
    if (!jsonMatch) throw new Error("JSON not properly formatted in response.");

    const suggestions = JSON.parse(jsonMatch[0]);
    if (!Array.isArray(suggestions)) throw new Error("Parsed data is not an array.");

    return suggestions.map(({ title, description, reasoning, estimatedPrice }) => ({
      title: title?.trim() || "Gift",
      description: description?.trim() || "No description available.",
      reasoning: reasoning?.trim() || "No reasoning provided.",
      estimatedPrice: estimatedPrice?.trim() || "Price unknown",
    }));
  } catch (error) {
    console.error("❌ Error generating suggestions:", error.message);
    return [
      {
        title: "Error",
        description: "Sorry, we couldn't generate suggestions at this time. Please try again.",
        reasoning: "AI service error.",
        estimatedPrice: "$0",
      },
    ];
  }
};
