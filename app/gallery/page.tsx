"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import ImageCard from "@/components/ImageCard";
import ImageModal from "@/components/ImageModal";
import { getUser, getUserImages, deleteGeneratedImage } from "@/lib/supabase";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { ImagePlus } from "lucide-react";

interface GeneratedImage {
  id: string;
  image_url: string;
  prompt: string;
  created_at: string;
}

export default function GalleryPage() {
  const router = useRouter();
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);

  useEffect(() => {
    const loadImages = async () => {
      try {
        const user = await getUser();
        if (!user) {
          router.push("/auth");
          return;
        }

        const userImages = await getUserImages(user.id);
        setImages(userImages);
      } catch (error) {
        console.error("Failed to load images:", error);
        toast.error("Failed to load your images. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    loadImages();
  }, [router]);

  const handleDelete = async (imageId: string) => {
    if (isDeleting) return;

    try {
      setIsDeleting(imageId);
      await deleteGeneratedImage(imageId);
      setImages(images.filter((img) => img.id !== imageId));
      toast.success("Image deleted successfully");
    } catch (error) {
      console.error("Failed to delete image:", error);
      toast.error("Failed to delete the image. Please try again.");
    } finally {
      setIsDeleting(null);
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
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

      <div className="container relative z-10 mx-auto px-4 pt-24 pb-16">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 text-transparent bg-clip-text">
              Your Generated Images
            </h1>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/generate")}
              className="flex items-center space-x-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-purple-500/20"
            >
              <ImagePlus className="w-5 h-5" />
              <span>Generate New</span>
            </motion.button>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-[60vh]">
              <div className="w-32 h-32 relative">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 animate-pulse"></div>
                <div className="absolute inset-4 rounded-lg bg-gradient-to-br from-purple-500/40 to-pink-500/40 animate-pulse delay-150"></div>
                <div className="absolute inset-8 rounded-md bg-gradient-to-br from-purple-500/60 to-pink-500/60 animate-pulse delay-300"></div>
              </div>
              <p className="text-gray-400 mt-6">Loading your masterpieces...</p>
            </div>
          ) : images.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mb-6">
                <ImagePlus className="w-12 h-12 text-gray-400" />
              </div>
              <p className="text-gray-300 text-lg text-center mb-6">
                Your gallery is empty. Start creating amazing images!
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push("/generate")}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-purple-500/20"
              >
                Generate Your First Image
              </motion.button>
            </div>
          ) : (
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {images.map((image) => (
                <motion.div key={image.id} variants={item}>
                  <ImageCard
                    imageUrl={image.image_url}
                    prompt={image.prompt}
                    createdAt={new Date(image.created_at)}
                    onDelete={() => handleDelete(image.id)}
                    onImageClick={() => setSelectedImage(image)}
                    isDeleting={isDeleting === image.id}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      <ImageModal
        imageUrl={selectedImage?.image_url || ""}
        prompt={selectedImage?.prompt || ""}
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </main>
  );
}
