export default function Home() {
  return (
    <main>
      <div className="flex flex-col">
        <div className="mx-auto mt-32 flex justify-center lg:w-full">
          <a
            href="/about"
            className="group rounded-2xl bg-gradient-to-b from-[#864DFF]/80 to-[#339DE9]/80 p-4 outline outline-1 outline-transparent transition-all hover:rounded-xl hover:border-opacity-80 hover:outline-white"
          >
            <h2 className={`mb-3 text-2xl font-semibold text-[#EAE2FF]`}>
              Hey there! I'm Melody!{" "}
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                -&gt;
              </span>
            </h2>
            <p className={`text-md m-0 max-w-3xl font-normal text-[#EAE2FF]`}>
              I'm 20 years old, I used to be a pro Overwatch player, competing
              for cash prizes as a tank player in various tournaments. But now,
              I've taken a fun detour! Over the last couple of months, I've been
              diving headfirst into the world of web design. I'm already having
              a blast and I'm even starting to get the hang of Java programming!
              I'm all about creating awesome, interactive websites that catch
              the eye. Combining my gaming background with design, I'm super
              pumped to bring some exciting projects to life! I've had quite the
              journey so far and I look excitedly towards the future,
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
              I specialize in making unique and eye-catching website designs
              that feel new, exciting, and inventive to use, ensuring your
              digital presence stands out in a crowded online landscape and
              leaves a lasting impression on your audience.
            </p>
          </a>
        </div>
      </div>
    </main>
  );
}
