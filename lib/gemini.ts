import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");

// Interface for image generation options
interface GenerateImageOptions {
  prompt: string;
  outputFormat?: string;
  responseModalities?: string[];
}

// Interface for image generation response
interface GeneratedImage {
  imageData: string;
  mimeType: string;
  text?: string;
}

/**
 * Generate an image using Google Gemini API
 * @param options - The options for image generation
 * @returns Promise with the generated image data
 */
export async function generateImage(options: GenerateImageOptions): Promise<GeneratedImage | null> {
  try {
    // Validate API key
    if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not defined in environment variables");
    }

    // Set up the model with image generation capabilities
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp-image-generation",
      generationConfig: {
        responseModalities: options.responseModalities || ["Text", "Image"],
      },
    });

    // Generate content based on the prompt
    const response = await model.generateContent(options.prompt);
    
    // Process the response to extract image and text data
    if (response?.response?.candidates?.[0]?.content?.parts) {
      for (const part of response.response.candidates[0].content.parts) {
        if (part.inlineData) {
          return {
            imageData: part.inlineData.data,
            mimeType: part.inlineData.mimeType,
            text: part.text,
          };
        }
      }
    }

    // If no image was found in the response
    return null;
  } catch (error) {
    console.error("Error generating image with Gemini:", error);
    throw error;
  }
}

/**
 * Generate an image with editing capabilities using Google Gemini API
 * @param prompt - The text prompt for image generation/editing
 * @param inputImage - Optional base64 encoded image for editing
 * @param mimeType - The MIME type of the input image
 * @returns Promise with the generated/edited image data
 */
export async function editImage(
  prompt: string,
  inputImage: string,
  mimeType: string = "image/png"
): Promise<GeneratedImage | null> {
  try {
    // Validate API key
    if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not defined in environment variables");
    }

    // Set up the model with image generation capabilities
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp-image-generation",
      generationConfig: {
        responseModalities: ["Text", "Image"],
      },
    });

    // Prepare the content parts with both text and image
    const contents = [
      { text: prompt },
      {
        inlineData: {
          mimeType: mimeType,
          data: inputImage,
        },
      },
    ];

    // Generate content based on the prompt and input image
    const response = await model.generateContent(contents);
    
    // Process the response to extract image and text data
    if (response?.response?.candidates?.[0]?.content?.parts) {
      for (const part of response.response.candidates[0].content.parts) {
        if (part.inlineData) {
          return {
            imageData: part.inlineData.data,
            mimeType: part.inlineData.mimeType,
            text: part.text,
          };
        }
      }
    }

    // If no image was found in the response
    return null;
  } catch (error) {
    console.error("Error editing image with Gemini:", error);
    throw error;
  }
}