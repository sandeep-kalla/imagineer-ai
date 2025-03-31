"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getUser, signOut } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import {
  ImagePlus,
  Edit,
  LogOut,
  Menu,
  X,
  ChevronDown,
  User,
  Image as ImageIcon,
} from "lucide-react";
import { toast } from "react-toastify";

interface UserData {
  id: string;
  email: string;
}

export default function Navbar() {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
      try {
        const userData = await getUser();
        if (userData && userData.email) {
          setUser({ id: userData.id, email: userData.email });
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchUser();
  }, []);

  const handleSignIn = () => {
    router.push("/auth");
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setUser(null);
      setIsMenuOpen(false);
      toast.success("Successfully signed out");
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to sign out. Please try again.");
    }
  };

  const handleProtectedNavigation = (route: string, feature: string) => {
    if (!user) {
      toast.dark(`🔒 Please sign in to access ${feature}`);
      return;
    }
    router.push(route);
  };

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-6xl z-50">
      <nav className="relative flex items-center justify-between px-6 py-3 bg-black/30 backdrop-blur-xl rounded-2xl border border-white/10 shadow-lg shadow-purple-500/20">
        {/* Left: Logo and Brand */}
        <Link href="/" className="flex items-center space-x-3 relative group">
          <Image src="/logo.png" alt="Logo" width={32} height={32} className="h-8 w-auto group-hover:scale-105 transition-transform " />
          <span className="font-bold text-xl text-white bg-clip-text group-hover:opacity-80 transition-all duration-300 font-['Poppins']">
              Imagineer AI
            </span>
          </Link>

        {/* Center: Navigation Items */}
        <div className="hidden md:flex items-center justify-center space-x-1 bg-white/5 rounded-xl p-1 mx-4">
            <Link
            href="/"
            className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:text-white transition-all duration-300 rounded-lg hover:bg-white/10"
            >
            <span className="font-medium">Home</span>
            </Link>
          <button
            onClick={() => handleProtectedNavigation("/generate", "image generation")}
            className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:text-white transition-all duration-300 rounded-lg hover:bg-white/10"
          >
            <ImagePlus className="w-4 h-4" />
            <span className="font-medium">Generate</span>
          </button>
          <button
            onClick={() => handleProtectedNavigation("/edit", "image editing")}
            className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:text-white transition-all duration-300 rounded-lg hover:bg-white/10"
          >
            <Edit className="w-4 h-4" />
            <span className="font-medium">Edit</span>
          </button>
        </div>

        {/* Right: Profile Menu */}
            {isLoading ? (
          <div className="h-9 w-9 bg-gray-800/50 animate-pulse rounded-full"></div>
            ) : user ? (
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center space-x-2 p-1.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group"
                >
              <div className="h-7 w-7 rounded-full bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-medium group-hover:shadow-[0_0_10px_rgba(168,85,247,0.5)] transition-shadow">
                    {user.email?.charAt(0).toUpperCase() || "U"}
                  </div>
              <ChevronDown className={cn(
                "w-4 h-4 text-gray-400 transition-transform duration-300",
                isMenuOpen && "rotate-180"
              )} />
                </button>

                {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-xl">
                <div className="py-1.5 space-y-1">
                  <div className="px-3 py-2 border-b border-white/10">
                    <p className="text-sm text-gray-400 truncate">
                      {user.email}
                    </p>
                  </div>
                      <Link
                        href="/gallery"
                    className="flex items-center space-x-2 w-full text-left px-3 py-2 text-gray-300 hover:bg-white/10 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <ImageIcon className="w-4 h-4" />
                        <span>My Gallery</span>
                      </Link>
                      <button
                        onClick={handleSignOut}
                    className="flex items-center space-x-2 w-full text-left px-3 py-2 text-gray-300 hover:bg-white/10 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={handleSignIn}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-white hover:opacity-90 transition-opacity"
              >
                <User className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            )}

        {/* Mobile Menu Button */}
          <button
          className="md:hidden text-gray-300 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors ml-4"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
      </nav>

        {/* Mobile Navigation Menu */}
        <div
          className={cn(
          "md:hidden overflow-hidden transition-all duration-300 ease-in-out mt-2",
          isMenuOpen ? "max-h-96" : "max-h-0"
          )}
        >
        <div className="bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-lg p-2 space-y-1">
            <Link
            href="/"
            className="flex items-center space-x-2 w-full px-3 py-2 text-gray-300 hover:text-white hover:bg-white/10 transition-colors rounded-lg"
              onClick={() => setIsMenuOpen(false)}
          >
            <span>Home</span>
          </Link>
          <button
            onClick={() => {
              setIsMenuOpen(false);
              handleProtectedNavigation("/generate", "image generation");
            }}
            className="flex items-center space-x-2 w-full px-3 py-2 text-gray-300 hover:text-white hover:bg-white/10 transition-colors rounded-lg"
            >
              <ImagePlus className="w-5 h-5" />
              <span>Generate</span>
          </button>
          <button
            onClick={() => {
              setIsMenuOpen(false);
              handleProtectedNavigation("/edit", "image editing");
            }}
            className="flex items-center space-x-2 w-full px-3 py-2 text-gray-300 hover:text-white hover:bg-white/10 transition-colors rounded-lg"
            >
              <Edit className="w-5 h-5" />
              <span>Edit</span>
          </button>
            {user && (
              <Link
                href="/gallery"
              className="flex items-center space-x-2 w-full px-3 py-2 text-gray-300 hover:text-white hover:bg-white/10 transition-colors rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                <ImageIcon className="w-5 h-5" />
                <span>Gallery</span>
              </Link>
            )}
        </div>
      </div>
    </div>
  );
}
