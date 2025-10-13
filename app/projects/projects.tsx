import { Showcase } from "../components/Showcase";
import Rnd0 from "../assets/images/projects/rnd_0.png";
import Rnd1 from "../assets/images/projects/rnd_1.png";


export function Projects() {
  const projects = [
    {
      title: "Random Question Generator",
      description: "Generate random questions for icebreakers, interviews, or fun conversations",
      link: "/random-question",
      image: <img src={Rnd0} className="w-full h-full" alt="Random Question Generator" />,
      hoverImage: <img src={Rnd1} className="w-full h-full" alt="Random Question Generator" />,
    },
    {
      title: "Text Compare Tool",
      description: "Compare two text documents and highlight differences",
      link: "/text-compare",
      image: "/favicon.svg",
      hoverImage: "/favicon.svg",
    },
    {
      title: "Bill Splitter",
      description: "Split bills and calculate tips with receipt scanning capabilities",
      link: "/bill-splitter",
      image: "/favicon.svg",
      hoverImage: "/favicon.svg",
    },
    {
      title: "Image to Base64",
      description: "Convert images to base64 format for easy embedding in web applications",
      link: "/image-to-base64",
      image: "/favicon.svg",
      hoverImage: "/favicon.svg",
    }
  ];

  return (
    <main className="flex items-center justify-center pt-16 pb-4">
      <div className="flex min-h-0 flex-1 flex-col items-center gap-16">
        <header className="flex flex-col items-center gap-9">
          <div className="w-[500px] max-w-[100vw] bg-zinc-800 p-6 rounded-lg">
            <h1 className="text-3xl font-bold text-white text-center mb-2">My Projects</h1>
            <p className="text-gray-400 text-center">A collection of useful web tools and utilities</p>
          </div>
        </header>
        <div className="w-full max-w-4xl px-4">
          <Showcase items={projects} />
        </div>
      </div>
    </main>
  );
}
