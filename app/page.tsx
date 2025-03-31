import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { SplashCursor } from "@/components/ui/splash-cursor";

export default function Home() {
  return (
    <>
      {/* Background container with splash cursor */}
      <div className="fixed inset-0 z-0">
        <SplashCursor />
      </div>

      <main className="relative min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/50 via-gray-900/50 to-black/50 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 z-[1]">
          {/* Purple Glow Orbs */}
          {/* Top Section Orbs */}
          <div className="absolute -top-40 -left-20 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-fuchsia-500/30 rounded-full blur-[100px] animate-pulse delay-700"></div>
          <div className="absolute top-1/4 -right-20 w-80 h-80 bg-violet-500/25 rounded-full blur-[110px] animate-pulse delay-1500"></div>

          {/* Middle Section Orbs */}
          <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-purple-800/30 rounded-full blur-[128px] animate-pulse delay-300"></div>
          <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-indigo-500/20 rounded-full blur-[90px] animate-pulse delay-1000"></div>
          <div className="absolute top-2/3 left-1/3 w-72 h-72 bg-pink-500/20 rounded-full blur-[100px] animate-pulse delay-2000"></div>

          {/* Bottom Section Orbs */}
          <div className="absolute -bottom-40 left-1/4 w-88 h-88 bg-purple-700/25 rounded-full blur-[115px] animate-pulse delay-500"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fuchsia-500/20 rounded-full blur-[128px] animate-pulse delay-1200"></div>
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-violet-600/25 rounded-full blur-[110px] animate-pulse delay-1800"></div>

          {/* Enhanced Gradient Mesh */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]"></div>

          {/* Enhanced Radial Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/90"></div>
        </div>

        {/* Content */}
        <div className="relative z-[2]">
          <Navbar />

          <div className="container relative mx-auto px-4 pt-24 pb-16 flex flex-col items-center justify-center text-center">
            <div className="max-w-4xl mx-auto space-y-6 py-12">
              {/* Hero Title with enhanced animation */}
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                Unleash Your{" "}
                <span className="bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 text-transparent bg-clip-text animate-text-gradient relative inline-block">
                  Creative Vision
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 via-fuchsia-500/20 to-pink-500/20 blur-xl -z-10"></div>
                </span>
              </h1>

              <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                Transform your ideas into stunning images with the power of AI.
                Generate, edit, and enhance visuals in seconds.
              </p>

              {/* Enhanced CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <Link
                  href="/generate"
                  className="group px-8 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:shadow-[0_0_2rem_0_rgba(167,139,250,0.5)] transition-all duration-300 shadow-lg shadow-purple-500/20 border border-purple-700/50 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600/40 to-pink-600/40 blur-xl group-hover:scale-150 transition-transform duration-300"></div>
                  <span className="relative">Try Now</span>
                </Link>
                <Link
                  href="/edit"
                  className="group px-8 py-3 rounded-lg bg-white/5 backdrop-blur-sm text-white font-medium hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-white/20 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative">Edit Images</span>
                </Link>
              </div>

              {/* Enhanced Feature Highlights */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
                {/* Feature 1 */}
                <div className="group p-6 bg-black/20 backdrop-blur-lg rounded-xl border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:shadow-[0_0_1rem_0_rgba(167,139,250,0.2)] relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative">
                    <div className="w-12 h-12 mb-4 bg-blue-600/20 rounded-lg flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-blue-500"
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
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Create Anything
                    </h3>
                    <p className="text-gray-400">
                      Generate stunning, unique images from simple text
                      descriptions
                    </p>
                  </div>
                </div>

                {/* Feature 2 */}
                <div className="group p-6 bg-black/20 backdrop-blur-lg rounded-xl border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:shadow-[0_0_1rem_0_rgba(167,139,250,0.2)] relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative">
                    <div className="w-12 h-12 mb-4 bg-purple-600/20 rounded-lg flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-purple-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Transform Images
                    </h3>
                    <p className="text-gray-400">
                      Upload and edit your own images with AI-powered tools
                    </p>
                  </div>
                </div>

                {/* Feature 3 */}
                <div className="group p-6 bg-black/20 backdrop-blur-lg rounded-xl border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:shadow-[0_0_1rem_0_rgba(167,139,250,0.2)] relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative">
                    <div className="w-12 h-12 mb-4 bg-green-600/20 rounded-lg flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-green-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Free to Start
                    </h3>
                    <p className="text-gray-400">
                      Begin with 30 free generations, Sign up to unlock access
                    </p>
                  </div>
                </div>
              </div>

              {/* Enhanced Image Showcase */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
                <div className="group aspect-square bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-lg overflow-hidden relative hover:shadow-[0_0_2rem_0_rgba(167,139,250,0.3)] transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/20 group-hover:to-purple-500/20 transition-all duration-300"></div>
                </div>
                <div className="group aspect-square bg-gradient-to-br from-pink-500/30 to-orange-500/30 rounded-lg overflow-hidden relative hover:shadow-[0_0_2rem_0_rgba(236,72,153,0.3)] transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-500/0 to-orange-500/0 group-hover:from-pink-500/20 group-hover:to-orange-500/20 transition-all duration-300"></div>
                </div>
                <div className="group aspect-square bg-gradient-to-br from-teal-500/30 to-green-500/30 rounded-lg overflow-hidden relative hover:shadow-[0_0_2rem_0_rgba(20,184,166,0.3)] transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-500/0 to-green-500/0 group-hover:from-teal-500/20 group-hover:to-green-500/20 transition-all duration-300"></div>
                </div>
                <div className="group aspect-square bg-gradient-to-br from-indigo-500/30 to-blue-500/30 rounded-lg overflow-hidden relative hover:shadow-[0_0_2rem_0_rgba(99,102,241,0.3)] transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 to-blue-500/0 group-hover:from-indigo-500/20 group-hover:to-blue-500/20 transition-all duration-300"></div>
                </div>
              </div>

              {/* Enhanced Footer */}
              <div className="mt-16 text-sm text-gray-500 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-pink-500/5 blur-xl -z-10"></div>
                <p className="relative">
                  © 2025 Imagineer AI. Powered by Gemini API. Not for commercial
                  use.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
