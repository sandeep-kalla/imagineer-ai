"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import { downloadImage, truncateText } from "@/lib/utils";
import { motion } from "framer-motion";
import { Download, Trash2, Clock, ChevronDown, ChevronUp } from "lucide-react";
import Loader from "@/components/Loader";

interface ImageCardProps {
  imageUrl: string;
  prompt: string;
  createdAt: Date;
  onDelete?: () => void;
  onImageClick?: () => void;
  isDeleting?: boolean;
}

export default function ImageCard({
  imageUrl,
  prompt,
  createdAt,
  onDelete,
  onImageClick,
  isDeleting = false,
}: ImageCardProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleDownload = () => {
    const filename = `imagineer-ai-${Date.now()}.png`;
    downloadImage(imageUrl, filename);
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 shadow-lg shadow-purple-500/10 transition-all duration-300 hover:shadow-purple-500/20">
      {/* Image Container */}
      <div
        className="relative aspect-square w-full overflow-hidden cursor-pointer"
        onClick={onImageClick}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="w-16 h-16 relative">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 animate-pulse"></div>
              <div className="absolute inset-2 rounded-lg bg-gradient-to-br from-purple-500/40 to-pink-500/40 animate-pulse delay-150"></div>
              <div className="absolute inset-4 rounded-md bg-gradient-to-br from-purple-500/60 to-pink-500/60 animate-pulse delay-300"></div>
            </div>
          </div>
        )}
        <Image
          src={imageUrl}
          alt={prompt || "Generated image"}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={`object-cover transition-all duration-500 ${
            isLoading ? "opacity-0 scale-105" : "opacity-100 scale-100"
          } group-hover:scale-105`}
          onLoad={() => setIsLoading(false)}
        />

        {/* Overlay with Actions */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-4 space-y-4">
            <div className="flex justify-end space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownload();
                }}
                className="p-2.5 rounded-xl bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all duration-300 border border-white/10"
                aria-label="Download image"
              >
                <Download className="w-5 h-5 text-white" />
              </motion.button>

              {onDelete && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                  }}
                  disabled={isDeleting}
                  className="p-2.5 rounded-xl bg-white/10 backdrop-blur-md hover:bg-red-500/80 transition-all duration-300 border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Delete image"
                >
                  {isDeleting ? (
                    <Loader size="sm" color="white" />
                  ) : (
                    <Trash2 className="w-5 h-5 text-white" />
                  )}
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Caption */}
      <div className="p-4 space-y-2 border-t border-white/5">
        <div className="flex items-center text-sm text-gray-400">
          <Clock className="w-4 h-4 mr-1.5 text-gray-500" />
          <span className="text-gray-500 text-xs">
            {formatDistanceToNow(createdAt, { addSuffix: true })}
          </span>
        </div>

        <div
          className="flex items-start space-x-2 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <p className="flex-1 text-sm text-gray-300">
            {isExpanded ? prompt : truncateText(prompt, 60)}
          </p>
          <button className="p-1 rounded-lg hover:bg-white/5 transition-colors">
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
