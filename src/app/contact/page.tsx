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
    <main className="container mx-auto mt-16">
      <div className="flex w-full justify-center">
        <h1 className="text-5xl font-bold text-white">
          Got a question? Contact me!
        </h1>
      </div>
      <div className="mx-auto flex flex-col">
        <div>
          <div className="rounded-2xl p-4 transition-all">
            <div className="mb-8">
              <h2 className="pb-4 text-2xl font-semibold text-[#EAE2FF]">
                Subject
              </h2>
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full text-black"
              />
            </div>
            <h2 className="pb-4 text-2xl font-semibold text-[#EAE2FF]">Body</h2>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="h-full w-full text-black"
            />
            <a className="flex flex-row justify-end mt-2" onClick={sendEmail}>
              <button className="flex p-2 bg-black/30 rounded-lg">
                <h1>Send</h1>
              </button>
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
