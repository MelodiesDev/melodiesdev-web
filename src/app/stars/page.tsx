"use client";



export default function StarsPage() {
  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center">
      <div className="bg-black/70 backdrop-blur-md p-3 rounded-lg w-64 text-white text-center">
        <h1 className="text-lg font-semibold mb-1">Sky Visualization</h1>
        <p className="text-sm">
          The sky visualization is already loaded in the background of the entire site.
        </p>
        <p className="text-xs mt-2">
          Use the controls in the corners to adjust the time and view.
        </p>
      </div>
    </div>
  );
} 