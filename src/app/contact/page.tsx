"use client";

import { useState } from "react";

export default function Contact() {
  const [subject, setSubject] = useState<string>("");
  const [body, setBody] = useState<string>("");

  function sendEmail(e: React.MouseEvent) {
    e.preventDefault();
    window.location.href = `mailto:melodiesdev@proton.me?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  return (
    <div className="container mx-auto flex flex-col items-center justify-center gap-8 text-black">
      <h1 className="font-bold text-4xl md:text-5xl">Got a question? Contact me!</h1>
      <h2 className="font-semibold text-2xl">Feel free to reach out - I'd love to hear from you!</h2>

      <form className="flex w-full flex-col gap-4 rounded-lg p-8 backdrop-blur-xl transition-all">
        <h2 className="font-bold font-serif text-2xl">Subject</h2>
        <input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full rounded-lg border border-slate-200 bg-black p-2 text-white placeholder-white focus:border-white focus:outline-none focus:ring-2 focus:ring-black"
          placeholder="What's on your mind?"
        />
        <h2 className="font-bold font-serif text-2xl">Message</h2>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="w-full rounded-lg border border-slate-200 bg-black p-2 text-white placeholder-white focus:border-white focus:outline-none focus:ring-2 focus:ring-black"
          placeholder="Tell me more about what you'd like to discuss..."
        />
        <div className="flex justify-end">
          <button
            type="button"
            onClick={sendEmail}
            className="cursor-pointer rounded-lg bg-black px-2 py-1 font-medium text-white transition-all duration-100 hover:scale-110"
          >
            Send Message
          </button>
        </div>
      </form>
    </div>
  );
}
