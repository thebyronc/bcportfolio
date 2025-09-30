import { Link } from "react-router";

export function Projects() {
  const projects = [
    {
      title: "Random Question Generator",
      description: "Generate random questions for icebreakers, interviews, or fun conversations",
      link: "/random-question",
    },
    {
      title: "Text Compare Tool",
      description: "Compare two text documents and highlight differences",
      link: "/text-compare",
    },
    {
      title: "Bill Splitter",
      description: "Split bills and calculate tips with receipt scanning capabilities",
      link: "/bill-splitter",
    },
    {
      title: "Image to Base64",
      description: "Convert images to base64 format for easy embedding in web applications",
      link: "/image-to-base64",
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project, index) => (
              <Link
                key={index}
                to={project.link}
                className="block bg-zinc-800 hover:bg-zinc-700 p-6 rounded-lg transition-colors group"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors mb-2">
                      {project.title}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {project.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
