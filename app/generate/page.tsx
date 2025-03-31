"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getUser,
  getUserGenerationCount,
  saveGeneratedImage,
} from "@/lib/supabase";
import { generateImage } from "@/lib/gemini";
import Navbar from "@/components/Navbar";
import ErrorMessage from "@/components/ErrorMessage";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const MAX_GENERATIONS_PER_DAY = 30;

export default function GeneratePage() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState<"1:1" | "16:9" | "9:16">(
    "1:1"
  );
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generationsLeft, setGenerationsLeft] = useState(
    MAX_GENERATIONS_PER_DAY
  );
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await getUser();
        if (!user) {
          router.push("/auth");
          return;
        }

        // Get user's generation count for today
        const count = await getUserGenerationCount(user.id);
        setGenerationsLeft(MAX_GENERATIONS_PER_DAY - count);
      } catch (error) {
        router.push("/auth");
      }
    };

    checkAuth();
  }, [router]);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt");
      toast.error("Please enter a prompt");
      return;
    }

    if (generationsLeft <= 0) {
      setError("You have reached your daily generation limit");
      toast.error("You have reached your daily generation limit");
      return;
    }

    setError(null);
    setIsLoading(true);
    setIsGenerating(true);
    const loadingToast = toast.loading("Generating your image...");

    try {
      // Step 1: Generate the image
      console.log("Generating image with prompt:", prompt.trim());
      const result = await generateImage({
        prompt: prompt.trim(),
        responseModalities: ["Text", "Image"],
      });

      if (!result || !result.imageData || !result.mimeType) {
        throw new Error("Failed to generate image: No image data returned");
      }

      console.log(
        "Image generated successfully with MIME type:",
        result.mimeType
      );
      const imageUrl = `data:${result.mimeType};base64,${result.imageData}`;
      setGeneratedImage(imageUrl);
      setGenerationsLeft((prev) => prev - 1);

      // Step 2: Save the generated image to the user's history
      try {
        const user = await getUser();
        if (!user) {
          console.log("User not authenticated, not saving image");
          toast.update(loadingToast, {
            render: "Image generated but not saved - please log in again",
            type: "warning",
            isLoading: false,
            autoClose: 5000,
          });
          setError("Image generated but not saved - please log in again");
          return;
        }

        console.log("Saving image to user history");
        await saveGeneratedImage(imageUrl, prompt, user.id);
        console.log("Image saved successfully to user history");
        toast.update(loadingToast, {
          render: "Image generated and saved successfully!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
      } catch (saveError: any) {
        console.error("Error saving image:", saveError);
        toast.update(loadingToast, {
          render: `Image generated but failed to save: ${
            saveError.message || "Unknown error"
          }`,
          type: "warning",
          isLoading: false,
          autoClose: 5000,
        });
        setError(
          `Image generated but failed to save to history: ${
            saveError.message || "Unknown error"
          }`
        );
      }
    } catch (error: any) {
      console.error("Error in image generation:", error);
      toast.update(loadingToast, {
        render: error.message || "Failed to generate image",
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
      setError(error.message || "Failed to generate image");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900 via-gray-900 to-black overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-[128px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fuchsia-500/20 rounded-full blur-[128px] animate-pulse delay-1000"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      </div>

      <Navbar />

      <div className="container relative z-10 mx-auto px-4 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Generate Form */}
            <motion.div
              className={`${
                isGenerating ? "lg:w-1/2" : "lg:w-3/5"
              } transition-all duration-700 ease-in-out`}
            >
              <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 p-8 shadow-lg shadow-purple-500/10">
                <h1 className="text-3xl font-bold text-white mb-6 bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 text-transparent bg-clip-text">
                  Generate Image
                </h1>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Prompt
                    </label>
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                      placeholder="Describe the image you want to generate..."
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Negative Prompt (Optional)
                    </label>
                    <textarea
                      value={negativePrompt}
                      onChange={(e) => setNegativePrompt(e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                      placeholder="Describe what you don't want in the image..."
                      rows={2}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      Aspect Ratio
                    </label>
                    <div className="flex space-x-4">
                      {(["1:1", "16:9", "9:16"] as const).map((ratio) => (
                        <button
                          key={ratio}
                          onClick={() => setAspectRatio(ratio)}
                          className={`px-6 py-2.5 rounded-xl font-medium transition-all duration-300 ${
                            aspectRatio === ratio
                              ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25"
                              : "bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10"
                          }`}
                        >
                          {ratio}
                        </button>
                      ))}
                    </div>
                  </div>

                  {error && <ErrorMessage message={error} />}

                  <div className="flex items-center justify-between pt-4">
                    <p className="text-gray-400 text-sm">
                      Generations left today:{" "}
                      <span className="text-purple-400 font-medium">{generationsLeft}</span>
                    </p>
                    <Button
                      onClick={handleGenerate}
                      disabled={isLoading || generationsLeft <= 0}
                      className="px-8 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/20"
                    >
                      {isLoading && (
                        <Loader size="sm" color="white" className="mr-2" />
                      )}
                      {isLoading ? "Generating..." : "Generate"}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Generated Image Preview */}
            <motion.div
              className={`${
                isGenerating ? "lg:w-1/2" : "lg:w-0"
              } transition-all duration-700 ease-in-out overflow-hidden`}
            >
              {isGenerating && (
                <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 p-8 shadow-lg shadow-purple-500/10 h-full">
                  {!generatedImage ? (
                    <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
                      <div className="w-32 h-32 relative">
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 animate-pulse"></div>
                        <div className="absolute inset-4 rounded-lg bg-gradient-to-br from-purple-500/40 to-pink-500/40 animate-pulse delay-150"></div>
                        <div className="absolute inset-8 rounded-md bg-gradient-to-br from-purple-500/60 to-pink-500/60 animate-pulse delay-300"></div>
                      </div>
                      <p className="text-gray-400 mt-6">
                        Crafting your masterpiece...
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 text-transparent bg-clip-text">
                        Generated Image
                      </h2>
                      <div className="relative aspect-square w-full rounded-xl overflow-hidden border border-white/10 shadow-lg shadow-purple-500/20">
                        <img
                          src={generatedImage}
                          alt="Generated image"
                          className="object-cover w-full h-full"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
}
