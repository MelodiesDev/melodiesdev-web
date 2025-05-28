"use client";

import { useState } from "react";
import { Glow, GlowCapture } from "@codaworks/react-glow";

export default function Contact() {
  const [subject, setSubject] = useState<string>("");
  const [body, setBody] = useState<string>("");

  function sendEmail(e: React.MouseEvent) {
    e.preventDefault();
    window.location.href = `mailto:melodiesdev@proton.me?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900 via-slate-900 to-black text-white overflow-hidden">
      {/* Decorative Elements */}
      <div className="fixed inset-0 bg-gradient-to-b from-transparent via-purple-900/20 to-black/50 pointer-events-none"></div>
      
      <div className="relative z-10 flex flex-col items-center px-4 pb-20 text-center md:px-8">
        <GlowCapture>
          <Glow color="rgb(147, 51, 234)">
            <div className="relative flex flex-col items-center justify-center px-8 md:px-0">
              <h1 className="pt-12 font-bold text-4xl md:text-5xl bg-clip-text bg-gradient-to-r from-white to-purple-200">
                Got a question? Contact me!
              </h1>
              <h2 className="max-w-xl pt-4 font-normal text-base text-purple-200/90">
                Feel free to reach out - I'd love to hear from you!
              </h2>

              <form className="mt-8 w-full max-w-4xl rounded-2xl border border-purple-500/20 bg-purple-950/10 p-8 backdrop-blur-xl shadow-[0_0_50px_-12px] shadow-purple-500/30 glow:border-purple-500/40 glow:bg-purple-900/20 transition-all">
                <div className="mb-6">
                  <h2 className="pb-3 text-xl font-semibold text-purple-200">
                    Subject
                  </h2>
                  <input
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full rounded-lg border border-purple-500/30 bg-purple-950/30 p-2 text-white placeholder-purple-300/50 focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                    placeholder="What's on your mind?"
                  />
                </div>
                <div className="mb-6">
                  <h2 className="pb-3 text-xl font-semibold text-purple-200">
                    Message
                  </h2>
                  <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    className="h-32 w-full rounded-lg border border-purple-500/30 bg-purple-950/30 p-2 text-white placeholder-purple-300/50 focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                    placeholder="Tell me more about what you'd like to discuss..."
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={sendEmail}
                    className="cursor-pointer rounded-xl bg-purple-600 px-6 py-3 font-medium text-white transition-all duration-300 hover:bg-purple-500"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </Glow>
        </GlowCapture>
      </div>
    </main>
  );
}
