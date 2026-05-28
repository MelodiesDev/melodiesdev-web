"use client";

import { SiGithub, SiX, SiYoutube } from "@icons-pack/react-simple-icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { ArrowLeft, ArrowUp, Volume2, VolumeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FaLinkedin } from "react-icons/fa";
import {
  SiBlender,
  SiDocker,
  SiDrizzle,
  SiGit,
  SiJavascript,
  SiKotlin,
  SiMongodb,
  SiNotion,
  SiPython,
  SiReact,
  SiSqlite,
  SiTypescript,
} from "react-icons/si";
import metaHorizon from "@/assets/meta-horizon.png";
import psylocke from "@/assets/psylocke.png";
import { LinkButton } from "@/components/LinkButton";
import { PrimaryLink } from "@/components/PrimaryLink";
import RotatingText from "@/components/RotatingText";

const carouselItems = [
  {
    name: "Black Hole",
    subtitle: "A force that sucks in blocks around it!",
    video: "/videos/blackhole.mp4",
  },
  {
    name: "Meteor Rain",
    subtitle: "Summons meteors to rain from the sky!",
    video: "/videos/meteorrain.mp4",
  },
  {
    name: "Divine Beam",
    subtitle: "Shoots a beam of light down from the heavens!",
    video: "/videos/divinebeam.mp4",
  },
] as const;

const techIcons = [
  { Icon: SiJavascript, label: "JavaScript" },
  { Icon: SiKotlin, label: "Kotlin" },
  { Icon: SiDocker, label: "Docker" },
  { Icon: SiMongodb, label: "MongoDB" },
  { Icon: SiSqlite, label: "SQLite" },
  { Icon: SiTypescript, label: "TypeScript" },
  { Icon: SiReact, label: "React" },
  { Icon: SiPython, label: "Python" },
  { Icon: SiDrizzle, label: "Drizzle ORM" },
  { Icon: SiBlender, label: "Blender" },
  { Icon: SiNotion, label: "Notion" },
  { Icon: SiGit, label: "Git" },
];

dayjs.extend(relativeTime);

export default function Home() {
  const [hoveredVideo, setHoveredVideo] = useState<number | null>(null);
  const [muted, setMuted] = useState(true);

  return (
    <div className="flex w-full flex-col items-center gap-32">
      {/* Hero Section */}
      <div className="container">
        <div className="flex w-full flex-col justify-center gap-4 lg:flex-row">
          <div className="flex w-full flex-col items-start justify-center gap-4 text-ink">
            <div className="flex w-full flex-col gap-2 rounded-lg border border-rule p-8 text-left shadow-xl backdrop-blur-xl transition-all">
              <h1 className="font-medium font-serif text-3xl leading-[1.05] tracking-tight lg:text-5xl">
                Hey there! I'm Melody!
              </h1>
              <div className="flex flex-col items-center gap-1 lg:flex-row">
                <span className="font-semibold text-base lg:text-2xl">I've been creating</span>
                <RotatingText
                  texts={["experiences", "worlds", "plugins", "games", "environments"]}
                  mainClassName="bg-ink text-base lg:text-2xl font-bold align-middle text-white overflow-hidden justify-center rounded-lg"
                  staggerFrom={"first"}
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "-150%" }}
                  staggerDuration={0.035}
                  splitLevelClassName="overflow-hidden"
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  rotationInterval={2000}
                />
                <div className="flex flex-row gap-2 lg:flex-none">
                  <span className="flex items-center font-semibold text-base lg:text-2xl">
                    players love for the past
                  </span>
                  <span className="rounded-lg bg-ink px-2 py-1 font-bold text-sm text-white lg:text-2xl">
                    {dayjs().from("2023-03-19", true)}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex w-full flex-col gap-4 lg:flex-row">
              <div className="flex flex-col items-center gap-2 rounded-lg border border-rule p-8 shadow-xl backdrop-blur-xl transition-all">
                <div className="grid grid-cols-2 items-center justify-center gap-4">
                  <LinkButton
                    href="https://x.com/melodiesdev"
                    label="My Twitter!"
                    className="transition-all hover:scale-110"
                  >
                    <SiX className="text-ink" />
                  </LinkButton>
                  <LinkButton
                    href="https://www.linkedin.com/in/melodiesdev/"
                    label="My LinkedIn!"
                    className="transition-all hover:scale-110"
                  >
                    <FaLinkedin className="text-ink" />
                  </LinkButton>
                  <LinkButton
                    href="https://github.com/melodiesdev"
                    label="My Github!"
                    className="transition-all hover:scale-110"
                  >
                    <SiGithub className="text-ink" />
                  </LinkButton>
                  <LinkButton
                    href="https://youtube.com/@MelodiesDevelopment"
                    label="My Youtube!"
                    className="transition-all hover:scale-110"
                  >
                    <SiYoutube className="text-ink" />
                  </LinkButton>
                </div>
              </div>
              <div className="flex w-full flex-col gap-2 rounded-lg border border-rule p-8 text-left shadow-xl backdrop-blur-xl transition-all">
                <div className="flex flex-col items-center gap-2 lg:flex-row">
                  <ArrowLeft className="hidden lg:block" />
                  <ArrowUp className="visible lg:hidden" />
                  <h2 className="font-medium font-serif text-3xl leading-[1.05] tracking-tight lg:text-4xl">
                    Connect with me here!
                  </h2>
                </div>
                <p className="text-xl">
                  If you like anything you see here please reach out I'd love to make something with you!
                </p>
              </div>
            </div>
            <ul
              aria-label="Technologies I work with"
              className="grid h-full w-full grid-cols-6 justify-between gap-2 rounded-lg border border-rule p-8 shadow-xl backdrop-blur-xl lg:flex lg:flex-row"
            >
              {techIcons.map(({ Icon, label }) => (
                <li key={label} className="flex items-center justify-center">
                  <Icon size={32} aria-label={label} className="transition-transform hover:scale-110" />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Projects Section */}
      <div className="container">
        <div className="flex w-full flex-col gap-16">
          <section className="w-full rounded-lg border border-rule-strong bg-paper p-8 shadow-xl lg:p-10">
            <div className="flex flex-col justify-between xl:flex-row">
              <div className="flex w-full flex-col items-start gap-2 text-left text-ink">
                <h2 className="pb-2 font-medium font-serif text-3xl leading-[1.05] tracking-tight lg:text-4xl">
                  Your Ultimate Marvel Rivals Companion!
                </h2>
                <p className="max-w-3xl text-xl leading-relaxed lg:text-2xl">
                  <span className="font-semibold">PSYLOCKE.GG</span> is a Marvel Rivals website that has an extensive
                  array of features such as a complete item database, voice line viewer, store tracker and all the
                  latest details on new characters added to the game!
                </p>
              </div>
            </div>

            <div className="pointer-events-none mt-8 overflow-hidden rounded-lg border border-rule shadow-xl">
              <Image
                src={psylocke}
                alt="Psylocke.gg homepage"
                className="w-full transition-transform duration-700 hover:scale-105"
              />
            </div>
            <div className="mt-8 flex justify-center">
              <PrimaryLink href="https://psylocke.gg">Visit PSYLOCKE.GG</PrimaryLink>
            </div>
          </section>

          <section className="w-full rounded-lg border border-rule-strong bg-paper p-8 shadow-xl lg:p-12">
            <div className="flex flex-col gap-12 text-ink">
              <div className="flex flex-col gap-6">
                <h2 className="sr-only">Meta Horizon</h2>
                <Image src={metaHorizon} alt="Meta Horizon" className="h-12 w-auto self-start lg:h-16" />
                <div className="h-px w-full bg-rule" />
              </div>

              <div className="flex flex-col gap-6">
                <h3 className="font-medium font-serif text-3xl leading-[1.05] tracking-tight lg:text-4xl">
                  Creator Academy
                </h3>
                <p className="max-w-4xl text-xl leading-relaxed lg:text-2xl">
                  I got the amazing opportunity to fly out to San Francisco for the Meta Horizon Worlds Creator Academy
                  and Meta Connect, an immersive program where a small group of creators came together to build, learn,
                  and ship original worlds for the platform. My academy project,{" "}
                  <span className="font-semibold">Locked In</span>, went on to win the award for{" "}
                  <span className="font-semibold">Outstanding Visual Design</span>, recognising the art direction,
                  environment, and overall visual polish of the world.
                </p>
                <PrimaryLink href="https://horizon.meta.com/world/4080898192123460">Play Locked In</PrimaryLink>
              </div>

              <div className="h-px w-full bg-rule" />

              <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-6">
                  <h3 className="font-medium font-serif text-3xl leading-[1.05] tracking-tight lg:text-4xl">
                    Studio Projects
                  </h3>
                  <p className="max-w-4xl text-xl leading-relaxed lg:text-2xl">
                    After the academy I worked on two projects with{" "}
                    <Link href="https://koding.dev" target="_blank" rel="noopener noreferrer" className="font-semibold">
                      KodingDev
                    </Link>{" "}
                    in San Francisco, <span className="font-semibold">Farm Inc.</span> and{" "}
                    <span className="font-semibold">Rummager</span>, built for{" "}
                    <span className="font-semibold">FutureTrash</span> in collaboration with{" "}
                    <Link href="https://foad.gg" target="_blank" rel="noopener noreferrer" className="font-semibold">
                      FOAD.gg
                    </Link>
                    . The two games took home two competition prizes totalling over{" "}
                    <span className="font-semibold">$75,000 USD</span>.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12 md:divide-x md:divide-rule">
                  <div className="flex flex-col gap-4 md:pr-12">
                    <h4 className="font-medium font-serif text-2xl tracking-tight">Farm Inc.</h4>
                    <p className="flex-1 text-lg">
                      Our first release into the Horizon competition circuit, taking home{" "}
                      <span className="font-semibold">Best Use of Camera API</span>.
                    </p>
                    <PrimaryLink href="https://horizon.meta.com/world/4096893230523956">Play Farm Inc.</PrimaryLink>
                  </div>

                  <div className="flex flex-col gap-4 md:pl-12">
                    <h4 className="font-medium font-serif text-2xl tracking-tight">Rummager</h4>
                    <p className="flex-1 text-lg">
                      The follow-up and our latest Horizon release, winning{" "}
                      <span className="font-semibold">Best Portrait Mode Implementation</span>.
                    </p>
                    <PrimaryLink href="https://horizon.meta.com/world/4135338773346068">Play Rummager</PrimaryLink>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Minecraft Plugins Section */}
      <section className="container">
        <div className="mb-8 flex flex-col items-center gap-2 text-center text-ink">
          <h2 className="font-medium font-serif text-3xl leading-[1.05] tracking-tight lg:text-5xl">
            Minecraft Plugins
          </h2>
          <p className="w-full font-semibold text-xl">
            Check out some of my Minecraft plugins featuring custom mechanics and particle effects!
          </p>
        </div>
        <div className="relative flex flex-wrap items-stretch justify-center gap-6 xl:flex-nowrap">
          {carouselItems.map((data, index) => (
            <VideoCard
              key={data.name}
              data={data}
              muted={muted}
              isActive={hoveredVideo === index}
              onActivate={() => setHoveredVideo(index)}
              onDeactivate={() => setHoveredVideo(null)}
              onToggleMute={() => setMuted((m) => !m)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

type VideoCardProps = {
  data: { name: string; subtitle: string; video: string };
  muted: boolean;
  isActive: boolean;
  onActivate: () => void;
  onDeactivate: () => void;
  onToggleMute: () => void;
};

function VideoCard({ data, muted, isActive, onActivate, onDeactivate, onToggleMute }: VideoCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isActive) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [isActive]);

  return (
    // biome-ignore lint/a11y/noNoninteractiveTabindex: card is focusable so keyboard users can trigger play-on-focus and reveal the mute button
    <article
      className="group/card relative aspect-video w-80 shrink-0 overflow-hidden rounded-lg border border-rule shadow-xl transition-all duration-150 hover:brightness-110 md:w-96"
      tabIndex={0}
      aria-label={`${data.name}: ${data.subtitle}`}
      onMouseEnter={onActivate}
      onMouseLeave={onDeactivate}
      onFocus={onActivate}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) onDeactivate();
      }}
    >
      <video
        ref={videoRef}
        src={data.video}
        className="aspect-video h-full w-full object-cover"
        loop
        muted={muted}
        playsInline
        preload="metadata"
      />
      <div className="pointer-events-none absolute inset-0 z-10 bg-linear-to-t from-black/85 via-black/55 to-black/15 p-4">
        <div className="flex h-full flex-col justify-end">
          <h3 className="font-semibold text-lg text-white">{data.name}</h3>
          <p className="text-sm text-white/90">{data.subtitle}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={onToggleMute}
        aria-label={muted ? "Unmute video" : "Mute video"}
        aria-pressed={!muted}
        className={
          "absolute right-3 bottom-3 z-20 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-black/55 text-white opacity-0 transition-all duration-150 hover:scale-110 hover:bg-black/80 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 group-focus-within/card:opacity-100 group-hover/card:opacity-100"
        }
      >
        {muted ? <VolumeOff size={18} /> : <Volume2 size={18} />}
      </button>
    </article>
  );
}
