"use client";

import { useState } from "react";

export default function Contact() {
  const [subject, setSubject] = useState<string>("");
  const [body, setBody] = useState<string>("");

  function sendEmail() {
    // Tell the browser to navigate to this URL.
    // Since it's handled by another application, it doesn't take you
    // away from the site, but still calls the mailto.
    window.location.href = `mailto:melodiesdev@proton.me
    ?subject=${encodeURIComponent(subject)}
    &body=${encodeURIComponent(body)}`;
  }

  return (
    <main className="container mx-auto mt-8">
      <div className="flex w-full justify-center">
        <h1 className="text-6xl font-black text-white">
          Got a question? Contact me!
        </h1>
      </div>
      <div className="mx-auto mt-32 flex flex-col">
        <div>
          <div className="group rounded-2xl bg-gradient-to-b from-[#864DFF]/80 to-[#339DE9]/80 p-4 outline outline-1 outline-transparent transition-all hover:rounded-xl hover:border-opacity-80 hover:outline-white">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-[#EAE2FF]">Subject</h2>
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full text-black"
              />
            </div>
            <h2 className="text-2xl font-semibold text-[#EAE2FF]">Body</h2>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="h-full w-full text-black"
            />
            <a onClick={sendEmail}>
              <h1 className="flex w-full justify-end">Send</h1>
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
