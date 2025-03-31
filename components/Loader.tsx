import React from "react";

interface LoaderProps {
  size?: "sm" | "md" | "lg";
  color?: "blue" | "purple" | "white";
  className?: string;
}

export default function Loader({
  size = "md",
  color = "blue",
  className = "",
}: LoaderProps) {
  const sizeClass = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-2",
    lg: "h-12 w-12 border-3",
  };

  const colorClass = {
    blue: "border-blue-500",
    purple: "border-purple-500",
    white: "border-white",
  };

  return (
    <div
      className={`rounded-full animate-spin border-t-transparent ${sizeClass[size]} ${colorClass[color]} ${className}`}
      aria-label="Loading"
    />
  );
}
