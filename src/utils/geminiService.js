import { GoogleGenerativeAI } from "@google/generative-ai";

// Using Gemini to run the prompt below and return an array of recipe names.
const API_KEY = "AIzaSyDIBQ_-II_C4DUzVGBEWMy2uOOdYGO4dOg";
const genAI = new GoogleGenerativeAI(API_KEY);
const PROMPT = `You are a helpful cooking assistant specializing in generating a list of ingredient names from an image. Your task is to analyze the provided image and detect which ingredients or food items are in the image.

Your response MUST be a valid JSON string that can be parsed into a JavaScript array of strings.

- If you can identify food, return an array of ingredient names.
  Example: ["Apple", "Orange", "Onion", "Carrot", "Pepper"]

- If the image does not contain identifiable food items, return ["Error: could not find any recipes based off of this image"].`;

// The food items are identified in the given image and recipe names are suggested for using those food items.
export const generateRecipesFromImage = async (base64Image, mimeType) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent([
      { text: PROMPT },
      { inlineData: { data: base64Image, mimeType } },
    ]);

    const text = await result.response.text(); 
    console.log("Gemini raw output:", text);

    return text;
  } catch (e) {
    console.error("Error calling Gemini API:", e);
    // This will inform the caller of the failure.
    throw new Error("The AI assistant failed to process the request.");
  }
};
