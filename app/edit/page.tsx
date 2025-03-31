"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import ErrorMessage from "@/components/ErrorMessage";
import { editImage } from "@/lib/gemini";
import {
  getUser,
  getUserGenerationCount,
  saveGeneratedImage,
} from "@/lib/supabase";
import { fileToDataUrl, FREE_GENERATION_LIMIT } from "@/lib/utils";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

export default function EditPage() {
  const router = useRouter();
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [editPrompt, setEditPrompt] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [generationCount, setGenerationCount] = useState(0);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isImageUploaded, setIsImageUploaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch user and generation count
  useEffect(() => {
    async function fetchUserData() {
      try {
        setIsLoadingUser(true);
        const userData = await getUser();
        setUser(userData);

        if (userData) {
          const count = await getUserGenerationCount(userData.id);
          setGenerationCount(count);
        } else {
          // Get generation count from localStorage for non-logged in users
          const storedCount = localStorage.getItem("generationCount");
          if (storedCount) {
            setGenerationCount(parseInt(storedCount, 10));
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to load user data. Please try again.");
      } finally {
        setIsLoadingUser(false);
      }
    }

    fetchUserData();
  }, []);

  // Check if the user has reached the free generation limit
  const canEdit = user || generationCount < FREE_GENERATION_LIMIT;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setError(null);
      // Convert the file to a data URL for preview
      const dataUrl = await fileToDataUrl(file);
      setUploadedImage(dataUrl as string);
      setEditedImage(null); // Clear any previous edited image
      setIsImageUploaded(true);
    } catch (error) {
      console.error("Error reading file:", error);
      setError("Failed to read the image file.");
      toast.error("Failed to read the image file.");
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    try {
      setError(null);
      // Convert the file to a data URL for preview
      const dataUrl = await fileToDataUrl(file);
      setUploadedImage(dataUrl as string);
      setEditedImage(null); // Clear any previous edited image
      setIsImageUploaded(true);
    } catch (error) {
      console.error("Error reading file:", error);
      setError("Failed to read the image file.");
      toast.error("Failed to read the image file.");
    }
  };

  const handleEditImage = async () => {
    if (!uploadedImage) {
      setError("Please upload an image to edit.");
      toast.error("Please upload an image to edit.");
      return;
    }

    if (!editPrompt.trim()) {
      setError("Please enter an edit prompt.");
      toast.error("Please enter an edit prompt.");
      return;
    }

    if (!canEdit) {
      setShowLoginPrompt(true);
      return;
    }

    try {
      setError(null);
      setIsEditing(true);
      const loadingToast = toast.loading("Editing your image...");

      // Extract base64 data and mime type from the data URL
      const [header, base64Data] = uploadedImage.split(",");
      const mimeType = header.split(":")[1]?.split(";")[0];

      // Edit the image using Gemini API with the proper base64 data
      const result = await editImage(editPrompt, base64Data, mimeType);
      if (!result) {
        throw new Error("Failed to edit image");
      }

      const editedImageUrl = `data:${result.mimeType};base64,${result.imageData}`;
      setEditedImage(editedImageUrl);

      // If the user is logged in, save the edited image to their history
      if (user) {
        try {
          await saveGeneratedImage(editedImageUrl, editPrompt, user.id);
          setGenerationCount((prev) => prev + 1);
          toast.update(loadingToast, {
            render: "Image edited and saved successfully!",
            type: "success",
            isLoading: false,
            autoClose: 3000,
          });
        } catch (saveError) {
          console.error("Error saving edited image:", saveError);
          toast.update(loadingToast, {
            render: "Image edited but failed to save to history",
            type: "warning",
            isLoading: false,
            autoClose: 5000,
          });
        }
      } else {
        // Increment the generation count for non-logged in users
        const newCount = generationCount + 1;
        setGenerationCount(newCount);
        // Store this in localStorage to track free tier usage
        localStorage.setItem("generationCount", String(newCount));
        toast.update(loadingToast, {
          render: "Image edited successfully!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Error editing image:", error);
      toast.error("Failed to edit image. Please try again.");
      setError("Failed to edit image. Please try again.");
    } finally {
      setIsEditing(false);
    }
  };

  const handleSignIn = () => {
    // Redirect to the auth page or trigger sign in
    router.push("/auth");
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-950 to-black">
      <Navbar />


      {/* Purple Glow Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl" />
      </div>



      <div className="container mx-auto px-4 py-24 pb-16 relative">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header Section */}
          <div className="text-center space-y-4">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500"
            >
              Edit Images
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-gray-400 max-w-2xl mx-auto"
            >
              Transform your images with AI-powered editing. Upload an image and describe the changes you want to make.
            </motion.p>
          </div>

          {isLoadingUser ? (
            <div className="flex justify-center items-center py-12">
              <div className="w-32 h-32 relative">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 animate-pulse"></div>
                <div className="absolute inset-4 rounded-lg bg-gradient-to-br from-purple-500/40 to-pink-500/40 animate-pulse delay-150"></div>
                <div className="absolute inset-8 rounded-md bg-gradient-to-br from-purple-500/60 to-pink-500/60 animate-pulse delay-300"></div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-8">
              <motion.div
                className={`${
                  isImageUploaded ? "lg:w-1/2" : "lg:w-full"
                } transition-all duration-700 ease-in-out`}
              >
                {/* Image Upload Area */}
                <div
                  className="bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 p-6 mb-8 flex flex-col items-center justify-center cursor-pointer relative overflow-hidden group shadow-lg shadow-purple-500/10"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />

                  {uploadedImage ? (
                    <div className="relative w-full aspect-square">
                      <Image
                        src={uploadedImage}
                        alt="Uploaded image"
                        fill
                        className="object-contain rounded-xl transition-transform group-hover:scale-105 duration-500"
                      />
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                        <p className="text-white text-sm bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm border border-white/10">
                          Click to change image
                        </p>
                      </div>
                      <button
                        className="absolute top-4 right-4 p-2 bg-black/60 backdrop-blur-sm hover:bg-red-500/80 rounded-xl transition-colors border border-white/10"
                        onClick={(e) => {
                          e.stopPropagation();
                          setUploadedImage(null);
                          setEditedImage(null);
                          setIsImageUploaded(false);
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div className="p-12 border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center transition-colors group-hover:border-purple-500/50 bg-white/5">
                      <div className="w-20 h-20 mb-6 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center group-hover:shadow-purple-500/20 group-hover:shadow-lg transition-all">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-10 w-10 text-gray-400 transition-colors group-hover:text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                      </div>
                      <p className="text-gray-300 text-center mb-2 transition-colors group-hover:text-white">
                        Drop your image here or click to browse
                      </p>
                      <p className="text-gray-500 text-sm text-center transition-colors group-hover:text-gray-400">
                        Supported formats: JPG, PNG, WebP
                      </p>
                    </div>
                  )}
                </div>

                {/* Edit Controls */}
                {isImageUploaded && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-lg shadow-purple-500/10"
                  >
                    <div className="space-y-4">
                      <label className="block">
                        <span className="text-gray-300 text-sm font-medium mb-2 block">
                          Edit Prompt
                        </span>
                        <textarea
                          value={editPrompt}
                          onChange={(e) => setEditPrompt(e.target.value)}
                          placeholder="Describe how you want to edit the image..."
                          className="w-full h-32 px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all resize-none"
                        />
                      </label>

                      {!canEdit && (
                        <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4 text-sm text-gray-300">
                          <p>
                            You&apos;ve reached the free generation limit. Sign in to continue editing images.
                          </p>
                        </div>
                      )}

                      <div className="flex justify-end">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleEditImage}
                          disabled={isEditing || !canEdit}
                          className={`px-6 py-3 rounded-xl font-medium flex items-center space-x-2 ${
                            isEditing
                              ? "bg-purple-500/50 cursor-not-allowed"
                              : !canEdit
                              ? "bg-gray-700/50 cursor-not-allowed"
                              : "bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 hover:opacity-90"
                          } text-white transition-all shadow-lg shadow-purple-500/20`}
                        >
                          {isEditing && (
                            <div className="w-5 h-5 relative">
                              <div className="absolute inset-0 rounded-full border-2 border-white/20 border-t-white animate-spin"></div>
                            </div>
                          )}
                          <span>{isEditing ? "Editing..." : "Edit Image"}</span>
                        </motion.button>
                      </div>

                      {error && (
                        <ErrorMessage message={error} className="mt-4" />
                      )}
                    </div>
                  </motion.div>
                )}
              </motion.div>

              {/* Result Section */}
              <motion.div
                className={`${
                  isImageUploaded ? "lg:w-1/2" : "lg:w-0"
                } transition-all duration-700 ease-in-out overflow-hidden`}
              >
                {editedImage ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-0 lg:mt-0 space-y-6"
                  >
                    <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
                      Edited Result
                    </h2>
                    <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-white/10 shadow-lg shadow-purple-500/10 bg-black/40 backdrop-blur-xl">
                      <Image
                        src={editedImage}
                        alt="Edited image"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </motion.div>
                ) : (
                  isImageUploaded && (
                    <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 p-6 h-full shadow-lg shadow-purple-500/10">
                      <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center space-y-6">
                        {isEditing ? (
                          <>
                            <div className="w-32 h-32 relative">
                              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 animate-pulse"></div>
                              <div className="absolute inset-4 rounded-lg bg-gradient-to-br from-purple-500/40 to-pink-500/40 animate-pulse delay-150"></div>
                              <div className="absolute inset-8 rounded-md bg-gradient-to-br from-purple-500/60 to-pink-500/60 animate-pulse delay-300"></div>
                            </div>
                            <p className="text-gray-400">
                              Creating your masterpiece...
                            </p>
                          </>
                        ) : (
                          <div className="space-y-4">
                            <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-10 w-10 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                />
                              </svg>
                            </div>
                            <div>
                              <p className="text-gray-300 font-medium">
                                Ready to Transform
                              </p>
                              <p className="text-gray-500 text-sm mt-2">
                                Enter your edit prompt and click Edit Image
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                )}
              </motion.div>
            </div>
          )}

          {/* Login prompt modal */}
          {showLoginPrompt && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gray-900 rounded-xl border border-gray-800 p-6 max-w-md w-full mx-4"
              >
                <h3 className="text-xl font-bold text-white mb-4">
                  Login Required
                </h3>
                <p className="text-gray-300 mb-6">
                  You&apos;ve used all your free edits. Sign in to continue editing
                  images.
                </p>
                <div className="flex space-x-4">
                  <button
                    onClick={handleSignIn}
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => setShowLoginPrompt(false)}
                    className="px-4 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
