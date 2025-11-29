import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * This file integrates with the Google Gemini API (Generative AI) to analyze
 * food images and generate a list of ingredient or recipe names.
 * It sends a predefined prompt along with the base64-encoded image to the
 * Gemini model, then returns the model's raw text response.
 */
const API_KEY = "AIzaSyDIBQ_-II_C4DUzVGBEWMy2uOOdYGO4dOg";

const genAI = new GoogleGenerativeAI(API_KEY);

/**
 * The text prompt sent to Gemini alongside the image.
 * It explicitly instructs the model to:
 *  - Detect and name visible food items or ingredients in the image.
 *  - Respond in valid JSON (array of strings).
 *  - Return an error message array if no food is detected.
 * This format ensures that the app can safely `JSON.parse()` the output.
 */
const PROMPT = `
You are a helpful cooking assistant specializing in generating a list of ingredient names from an image. 
Your task is to analyze the provided image and detect which ingredients or food items are in the image.

Your response MUST be a valid JSON string that can be parsed into a JavaScript array of strings.

- If you can identify food, return an array of ingredient names.
  Example: ["Apple", "Orange", "Onion", "Carrot", "Pepper"]

- If the image does not contain identifiable food items, return ["Error: could not find any recipes based off of this image"].
`;

/**
 * Sends a food image to the Gemini API and retrieves an array of suggested
 * ingredients or recipe names.
 */
export const generateRecipesFromImage = async (base64Image, mimeType) => {
  try {
    // Create a generative model instance using Gemini 2.5 Flash.
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    /**
     * Send the prompt and image to the model for processing.
     * The Gemini API supports multimodal input (text + image).
     */
    const result = await model.generateContent([
      { text: PROMPT },
      { inlineData: { data: base64Image, mimeType } },
    ]);

    // Extract the text response from the API result.
    const text = await result.response.text();

    // Log the raw AI output for debugging and verification.
    console.log("Gemini raw output:", text);

    // Return the text (expected to be valid JSON).
    return text;
  } catch (e) {
    // Handle API or network errors gracefully.
    console.error("Error calling Gemini API:", e);

    // Throw a clean, user-friendly error for upper layers to handle.
    throw new Error("The AI assistant failed to process the request.");
  }
};
