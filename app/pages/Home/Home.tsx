import "./home.css";
import ListHoverBox from "../../components/ListHoverBox/ListHoverBox";
import LinkedInIcon from "../../assets/LinkedInIcon";
import GitHubIcon from "../../assets/GitHubIcon";
import GmailIcon from "../../assets/GmailIcon";

export default function Home() {
  return (
    <div className="flex justify-center px-6 py-12 font-sans md:px-12 md:py-16 lg:py-24">
      <div className="grid w-full max-w-screen-xl grid-cols-1 gap-12 lg:grid-cols-8">
        <div className="px-4 lg:col-span-3 xl:col-span-3">
          <header className="sticky md:top-16 lg:top-24 lg:max-h-screen">
            <h1 className="mb-2 text-4xl font-bold text-zinc-200">
              Byron Chang
            </h1>
            <h2 className="mb-4 text-lg font-medium text-zinc-300">
              Front End Engineer
            </h2>
            <p className="mb-4 text-zinc-400">
              I am a software engineer with a passion for building user-friendly
              and efficient web applications.
            </p>
            <div className="flex gap-4">
              <a
                href="https://www.linkedin.com/in/byronchang"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-transparent bg-zinc-800/50 p-2 text-zinc-300 transition-all duration-200 hover:border-zinc-600 hover:bg-zinc-700/50 hover:text-zinc-100"
                aria-label="LinkedIn Profile"
              >
                <LinkedInIcon className="h-5 w-5" />
              </a>
              <a
                href="https://github.com/thebyronc"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-transparent bg-zinc-800/50 p-2 text-zinc-300 transition-all duration-200 hover:border-zinc-600 hover:bg-zinc-700/50 hover:text-zinc-100"
                aria-label="GitHub Profile"
              >
                <GitHubIcon className="h-5 w-5" />
              </a>
              <a
                href="mailto:thebyronc@gmail.com"
                className="rounded-lg border border-transparent bg-zinc-800/50 p-2 text-zinc-300 transition-all duration-200 hover:border-zinc-600 hover:bg-zinc-700/50 hover:text-zinc-100"
                aria-label="Email thebyronc@gmail.com"
              >
                <GmailIcon className="h-5 w-5" />
              </a>
            </div>
          </header>
        </div>
        <main className="px-4 lg:col-span-5 xl:col-span-5">
          <section className="mb-16">
            <h2 className="mb-2 text-2xl font-bold text-zinc-400">About Me</h2>
            <p className="mb-2 text-zinc-300">
              Senior Front-End Engineer with 8+ years of experience building
              scalable React and Node.js applications across enterprise
              platforms.
            </p>
            <p className="mb-2 text-zinc-300">
              I’m committed to crafting interfaces that empower users through
              accessible design and robust engineering.
            </p>
            <p className="mb-2 text-zinc-300">
              Expert in TypeScript, semantic HTML/CSS, using automation tools to
              streamline workflows.
            </p>
            <p className="mb-2 text-zinc-300">
              Led UI development at Nike for global diagnostics platforms,
              architecting modular systems and deploying to Azure. Passionate
              about developer experience, testing rigor, and secure,
              maintainable code. Skilled in CI/CD pipelines, OAuth, and
              cross-functional collaboration.
            </p>
          </section>

          <section className="">
            <ul>
              <li>
                <ListHoverBox
                  title="Software Engineer - Nike Inc. (Contractor)"
                  subtitle="Beaverton, Oregon"
                  date="2020 - 2025"
                  skills={[
                    "React.js",
                    "TypeScript",
                    "Redux",
                    "C#/.Net",
                    "Azure",
                    "CI/CD",
                    "PowerShell",
                    "Figma",
                  ]}
                  items={[
                    "Led pixel-perfect UI development for global diagnostics platforms used across Nike's internal teams",
                    "Architected scalable front-end systems using React, TypeScript, and modular UI principles, ARIA roles, improving maintainability across multiple internal platforms.",
                    "Developed C#/.NET backend features to efficiently shape and deliver diagnostic data, contributing to system reliability and performance.",
                    "Deployed diagnostic services and internal tools to Azure, leveraging cloud infrastructure for scalability, security, and streamlined operations.",
                    "Built a Node.js diagnostic server to remotely manage system health and modernize legacy workflow",
                    "Collaborated cross-functionally with designers and PMs to deliver user-centric features with measurable impact on engagement and retention",
                    "Spearheaded DX initiatives including GitHub Actions pipelines and OAuth integrations, reducing deployment friction and onboarding time.",
                  ]}
                />
              </li>
              <li>
                <ListHoverBox
                  title="Software Engineer - Ansira"
                  subtitle="Portland, Oregon"
                  date="2018 - 2020"
                  skills={[
                    "Vue.js",
                    "Angular.js",
                    "Java/Kotlin",
                    "PHP",
                    "React.js",
                  ]}
                  items={[
                    "Delivered multi-site front-end solutions using a shared template model and React-based architecture",
                    "Streamlined onboarding with standardized Git workflows, bash environments, and SSL configurations",
                    "Mentored interns and juniors while improving hiring assessments and documentation",
                    "Authored client-facing documentation to clarify technical processes and reduce support escalations.",
                  ]}
                />
              </li>
            </ul>
          </section>
        </main>
      </div>
    </div>
  );
}
