import React from 'react';

export default function Loading() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white/90 dark:bg-gray-950/90 backdrop-blur-md z-50 transition-all duration-300">
      <div className="flex flex-col items-center gap-4">
        {/* Animated Amber Spinner */}
        <div className="relative w-16 h-16 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-4 border-amber-500/20"></div>
          <div className="absolute inset-0 rounded-full border-4 border-amber-500 border-t-transparent animate-spin"></div>
        </div>

        {/* Branded Shimmer Text */}
        <div className="text-2xl font-black tracking-wider relative overflow-hidden font-urdu text-amber-600 dark:text-amber-500">
          <span>SilkShine</span>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium tracking-wide uppercase">Loading...</p>
      </div>
    </div>
  );
}
