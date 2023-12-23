"use client";

import { Glow, GlowCapture } from "@codaworks/react-glow";
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
    <GlowCapture>
      <Glow color="white" debug={false} className="">
        <main className="container mx-auto mt-16">
          <div className="flex w-full justify-center">
            <h1 className="text-6xl font-black text-white">
              Got a question? Contact me!
            </h1>
          </div>
          <div className="mx-auto my-24 flex flex-col">
            <div>
              <div className="rounded-2xl bg-gradient-to-b from-[#864DFF]/80 to-[#339DE9]/80 p-4 outline-glow transition-all glow:bg-glow glow:outline glow:outline-white">
                <div className="mb-8">
                  <h2 className="text-2xl font-semibold text-[#EAE2FF]">
                    Subject
                  </h2>
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
                <a
                  className="flex flex-row justify-end mt-2"
                  onClick={sendEmail}
                >
                  <button className="flex rounded-2xl bg-gradient-to-br from-[#79E7FF]/50 to-[#8FFF8D]/50 p-2">
                    <h1>Send</h1>
                  </button>
                </a>
              </div>
            </div>
          </div>
        </main>
      </Glow>
    </GlowCapture>
  );
}
