export default function Home() {
  return (
    <main>
      <div className="flex flex-col">
        <div className="mx-auto mt-32 flex justify-center lg:w-full">
          <a
            href="/about"
            className="group rounded-2xl bg-gradient-to-b from-[#864DFF]/80 to-[#339DE9]/80 p-4 outline outline-1 outline-transparent transition-all hover:rounded-xl hover:border-opacity-80 hover:outline-white"
          >
            <div className="flex flex-row justify-between">
              <h2 className="mb-3 text-2xl font-semibold text-[#EAE2FF]">
                Hey there! I'm Melody!{" "}
              </h2>
              <span className="inline-block font-normal transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                More -&gt;
              </span>
            </div>
            <p className={`text-md m-0 max-w-3xl font-normal text-[#EAE2FF]`}>
              I'm 20 years old and currently living in Australia, over the past
              year I have been learning Web Design and Web Development to do as
              my main job. Fun fact I used to play in Overwatch tournaments like
              AOL playing in various teams before I did any of this... this is
              way less stressful.
            </p>
          </a>
        </div>
        <div className="mx-auto flex justify-center pt-16 lg:w-full">
          <a
            href="/projects"
            className="group rounded-2xl bg-gradient-to-b from-[#864DFF]/80 to-[#339DE9]/80 p-4 outline outline-1 outline-transparent transition-all hover:rounded-xl hover:outline-white"
          >
            <h2 className={`mb-3 text-2xl font-semibold`}>
              What I Do!{" "}
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                -&gt;
              </span>
            </h2>
            <p className={`text-md m-0 max-w-3xl font-normal text-white`}>
              I love making fun and playful websites that look and feel
              different and have a smooth user experience. Something unique is
              what I do best so if thats what you're looking for you've come to
              the right place!
            </p>
          </a>
        </div>
      </div>
    </main>
  );
}
