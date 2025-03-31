import { motion, AnimatePresence } from "framer-motion";
import { X, Download, ZoomIn, ZoomOut } from "lucide-react";
import { useState } from "react";
import { downloadImage } from "@/lib/utils";

interface ImageModalProps {
  imageUrl: string;
  prompt: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ImageModal({
  imageUrl,
  prompt,
  isOpen,
  onClose,
}: ImageModalProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const filename = `imagineer-ai-${Date.now()}.png`;
      await downloadImage(imageUrl, filename);
    } catch (error) {
      console.error("Error downloading image:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/90 backdrop-blur-xl"
            onClick={onClose}
          />

          {/* Modal Content */}
          <div className="relative h-full w-full flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.3, type: "spring", damping: 25 }}
              className="relative max-w-6xl w-full bg-black/40 rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-purple-500/20"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="relative flex items-center justify-between px-6 py-4 bg-black/60 border-b border-white/10">
                <motion.h3
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm font-medium text-gray-200 truncate max-w-[calc(100%-8rem)]"
                >
                  {prompt}
                </motion.h3>
                <div className="flex items-center space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300 border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Download image"
                  >
                    <Download className="w-5 h-5 text-white" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsZoomed(!isZoomed)}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300 border border-white/10"
                    aria-label={isZoomed ? "Zoom out" : "Zoom in"}
                  >
                    {isZoomed ? (
                      <ZoomOut className="w-5 h-5 text-white" />
                    ) : (
                      <ZoomIn className="w-5 h-5 text-white" />
                    )}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onClose}
                    className="p-2 rounded-xl bg-white/10 hover:bg-red-500/80 transition-all duration-300 border border-white/10"
                    aria-label="Close modal"
                  >
                    <X className="w-5 h-5 text-white" />
                  </motion.button>
                </div>
              </div>

              {/* Image Container */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="relative p-6"
              >
                <div
                  className={`relative mx-auto ${
                    isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"
                  }`}
                  onClick={() => setIsZoomed(!isZoomed)}
                >
                  <motion.img
                    src={imageUrl}
                    alt={prompt}
                    className="w-full h-auto rounded-xl shadow-2xl shadow-purple-500/10"
                    initial={false}
                    animate={{
                      scale: isZoomed ? 1.5 : 1,
                      transition: { duration: 0.3 },
                    }}
                    style={{
                      maxHeight: "calc(80vh - 12rem)",
                      objectFit: "contain",
                    }}
                  />
                </div>
              </motion.div>

              {/* Footer */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="px-6 pb-6"
              >
                <p className="text-sm text-gray-400 text-center max-w-2xl mx-auto">
                  {prompt}
                </p>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
