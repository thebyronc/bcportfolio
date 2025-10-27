export default function Welcome() {
  return (
    <main className="flex items-center justify-center pt-16 pb-4">
      
      <div className="flex min-h-0 flex-1 flex-col items-center gap-16">
        <header className="flex flex-col items-center gap-9">
          <div className="w-[500px] max-w-[100vw] p-4"></div>
        </header>
        <div className="w-full max-w-[800px] space-y-6 px-4">
          <nav className="space-y-4 rounded-3xl border border-zinc-700 p-6">
            <p className="text-center text-2xl leading-6 font-bold text-zinc-200">
              BYRON CHANG
            </p>

            {/* Contact Information */}
            <div className="text-center text-zinc-300">
              <p>
                971-777-0013 | thebyronc@gmail.com |{" "}
                <a
                  href="http://www.linkedin.com/in/byronchang"
                  className="text-blue-400 hover:underline"
                >
                  LinkedIn
                </a>
              </p>
            </div>

            {/* Title */}
            <div className="text-center font-semibold text-zinc-200">
              SOFTWARE ENGINEER
            </div>
            <div className="text-center text-sm text-zinc-300">
              React & TypeScript Focus | Developer Experience Advocate | Mission-Driven Builder
            </div>

            {/* Summary */}
            <section className="mt-8">
              <h2 className="mb-2 text-xl font-semibold text-zinc-100">
                Professional Summary
              </h2>
              <p className="text-zinc-300">
                Creative and impact-oriented engineer with 8+ years of experience crafting scalable web platforms and internal tools. Expert in React, TypeScript, and developer experience strategy. Passionate about developer experience, mentorship, and building polished interfaces that empower users and teams alike.
              </p>
            </section>

            {/* Experience */}
            <section className="mt-8">
              <h2 className="mb-2 text-xl font-semibold text-zinc-100">
                Work Experience
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-zinc-200">
                    Software Engineer III (Contractor)
                  </h3>
                  <p className="text-zinc-300">
                    Nike, Inc. • Portland, Oregon • March 2020 – June 2025
                  </p>
                  <ul className="mt-2 list-inside list-disc space-y-1 text-zinc-300">
                    <li>
                      Led pixel-perfect UI development for global diagnostics platforms used across Nike's internal teams
                    </li>
                    <li>
                      Architected scalable front-end systems using React, TypeScript, and modular UI principles, ARIA roles, improving maintainability across multiple internal platforms.
                    </li>
                    <li>
                      Developed C#/.NET backend features to efficiently shape and deliver diagnostic data, contributing to system reliability and performance.
                    </li>
                    <li>
                      Deployed diagnostic services and internal tools to Azure, leveraging cloud infrastructure for scalability, security, and streamlined operations.
                    </li>
                    <li>
                      Built a Node.js diagnostic server to remotely manage system health and modernize legacy workflow
                    </li>
                    <li>
                      Collaborated cross-functionally with designers and PMs to deliver user-centric features with measurable impact on engagement and retention
                    </li>
                    <li>
                      Spearheaded DX initiatives including GitHub Actions pipelines and OAuth integrations, reducing deployment friction and onboarding time.
                    </li>
                    <li>
                      Drove cross-team collaboration and elevated code quality through mentoring, peer reviews, and Agile ceremonies.
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-zinc-200">
                    Software Engineer
                  </h3>
                  <p className="text-zinc-300">
                    Ansira • Portland, Oregon • August 2018 – March 2020
                  </p>
                  <ul className="mt-2 list-inside list-disc space-y-1 text-zinc-300">
                    <li>
                      Delivered multi-site front-end solutions using a shared template model and React-based architecture.
                    </li>
                    <li>
                      Streamlined onboarding with standardized Git workflows, bash environments, and SSL configurations.
                    </li>
                    <li>
                      Mentored interns and juniors while improving hiring assessments and documentation.
                    </li>
                    <li>
                      Authored client-facing documentation to clarify technical processes and reduce support escalations.
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Education */}
            <section className="mt-8">
              <h2 className="mb-2 text-xl font-semibold text-zinc-100">
                Education
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-zinc-200">
                    Bachelor of Science in Arts
                  </h3>
                  <p className="text-zinc-300">
                    University of Oregon (Multimedia & Technical Design)
                  </p>
                </div>
              </div>
            </section>

            {/* Skills */}
            <section className="mt-8">
              <h2 className="mb-2 text-xl font-semibold text-zinc-100">
                Technical Skills
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="mb-2 font-medium text-zinc-200">
                    Frontend
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-zinc-700 px-3 py-1 text-zinc-200">
                      React
                    </span>
                    <span className="rounded-full bg-zinc-700 px-3 py-1 text-zinc-200">
                      TypeScript
                    </span>
                    <span className="rounded-full bg-zinc-700 px-3 py-1 text-zinc-200">
                      HTML5
                    </span>
                    <span className="rounded-full bg-zinc-700 px-3 py-1 text-zinc-200">
                      CSS3
                    </span>
                    <span className="rounded-full bg-zinc-700 px-3 py-1 text-zinc-200">
                      Redux
                    </span>
                    <span className="rounded-full bg-zinc-700 px-3 py-1 text-zinc-200">
                      Figma
                    </span>
                    <span className="rounded-full bg-zinc-700 px-3 py-1 text-zinc-200">
                      AngularJS
                    </span>
                    <span className="rounded-full bg-zinc-700 px-3 py-1 text-zinc-200">
                      Jest
                    </span>
                    <span className="rounded-full bg-zinc-700 px-3 py-1 text-zinc-200">
                      TailwindCSS
                    </span>
                    <span className="rounded-full bg-zinc-700 px-3 py-1 text-zinc-200">
                      Next.js
                    </span>
                  </div>
                </div>
                <div>
                  <h3 className="mb-2 font-medium text-zinc-200">
                    Backend & Scripting
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-zinc-700 px-3 py-1 text-zinc-200">
                      Node.js
                    </span>
                    <span className="rounded-full bg-zinc-700 px-3 py-1 text-zinc-200">
                      C#
                    </span>
                    <span className="rounded-full bg-zinc-700 px-3 py-1 text-zinc-200">
                      .NET
                    </span>
                    <span className="rounded-full bg-zinc-700 px-3 py-1 text-zinc-200">
                      Bash
                    </span>
                    <span className="rounded-full bg-zinc-700 px-3 py-1 text-zinc-200">
                      PowerShell
                    </span>
                    <span className="rounded-full bg-zinc-700 px-3 py-1 text-zinc-200">
                      SQL/NoSQL
                    </span>
                    <span className="rounded-full bg-zinc-700 px-3 py-1 text-zinc-200">
                      Azure
                    </span>
                  </div>
                </div>
                <div>
                  <h3 className="mb-2 font-medium text-zinc-200">
                    Dev Practices
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-zinc-700 px-3 py-1 text-zinc-200">
                      CI/CD
                    </span>
                    <span className="rounded-full bg-zinc-700 px-3 py-1 text-zinc-200">
                      GitHub Actions
                    </span>
                    <span className="rounded-full bg-zinc-700 px-3 py-1 text-zinc-200">
                      SOLID
                    </span>
                    <span className="rounded-full bg-zinc-700 px-3 py-1 text-zinc-200">
                      Agile/Scrum
                    </span>
                  </div>
                </div>
                <div>
                  <h3 className="mb-2 font-medium text-zinc-200">
                    Monitoring & Optimization
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-zinc-700 px-3 py-1 text-zinc-200">
                      System diagnostics tooling
                    </span>
                    <span className="rounded-full bg-zinc-700 px-3 py-1 text-zinc-200">
                      Performance troubleshooting
                    </span>
                  </div>
                </div>
              </div>
            </section>
          </nav>
        </div>
      </div>
    </main>
  );
}

