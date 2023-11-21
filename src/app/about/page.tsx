export default function About() {
  return (
    <main className="container flex">
      <div className="mt-8 flex w-full justify-center text-6xl font-black text-white">
        <h1>Here's a little bit more about me!</h1>
      </div>
      <div className="flex flex-col">
        <div className="mx-auto mt-32 flex justify-center">
          <div className="group rounded-2xl bg-gradient-to-b from-[#864DFF]/80 to-[#339DE9]/80 p-4 outline outline-1 outline-transparent transition-all hover:rounded-xl hover:border-opacity-80 hover:outline-white">
            <h2 className="mb-3 text-2xl font-semibold text-[#EAE2FF]">
              Well since you wanted to know more...
            </h2>
            <p className="text-md font-normal text-[#EAE2FF]">
              I live with my gorgeous girlfriend Stella who works in the same
              field as me and is wayyyy better than me at a lot of things. BUT.
              I have started to catch up.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
