import { TextBlock } from "@/components/TextBlock";

export default function About() {
  return (
    <main className="container mx-auto justify-center">
      <div className="mt-16 flex w-full justify-center">
        <h1 className="text-6xl font-black text-white">
          Here's a little bit more about me!
        </h1>
      </div>
      <div className="pt-16">
        <TextBlock
          header="Well since you wanted to know more..."
          body=" I live with my gorgeous girlfriend Stella who works in the same
              field as me and is wayyyy better than me at a lot of things. BUT.
              I have started to catch up."
        />
      </div>
    </main>
  );
}
