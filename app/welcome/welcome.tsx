export function Welcome() {
  return (
    <main className="flex items-center justify-center pt-16 pb-4">
      <div className="flex min-h-0 flex-1 flex-col items-center gap-16">
        <header className="flex flex-col items-center gap-9">
          <div className="w-[500px] max-w-[100vw] p-4"></div>
        </header>
        <div className="w-full max-w-[800px] space-y-6 px-4">
          <nav className="space-y-4 rounded-3xl border border-gray-200 p-6 dark:border-gray-700">
            <p className="text-center text-2xl leading-6 font-bold text-gray-700 dark:text-gray-200">
              BYRON CHANG
            </p>

            {/* Contact Information */}
            <div className="text-center text-gray-600 dark:text-gray-300">
              <p>
                971-777-0013 | thebyronc@gmail.com |{" "}
                <a
                  href="http://www.linkedin.com/in/byronchang"
                  className="text-blue-600 hover:underline dark:text-blue-400"
                >
                  LinkedIn
                </a>
              </p>
            </div>

            {/* Title */}
            <div className="text-center font-semibold text-gray-700 dark:text-gray-200">
              SOFTWARE ENGINEER III
            </div>

            {/* Summary */}
            <section className="mt-8">
              <h2 className="mb-2 text-xl font-semibold text-gray-800 dark:text-gray-100">
                Professional Summary
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Specializing in Front-End Development, Automation, and Scalable
                Architectures. I thrive in complex and ambiguous environments,
                taking initiative to optimize workflows, innovate solutions, and
                deliver high-impact results. A track record of success at Nike
                and Ansira, delivering custom solutions for internal teams and
                high-profile clients including Petco, Portland Trail Blazers,
                and GoHealth Urgent Care. Driven by a passion for continuous
                learning and growth, coupled with a commitment to mentoring and
                collaborating across teams.
              </p>
            </section>

            {/* Experience */}
            <section className="mt-8">
              <h2 className="mb-2 text-xl font-semibold text-gray-800 dark:text-gray-100">
                Work Experience
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-gray-700 dark:text-gray-200">
                    Software Engineer III (Contractor)
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Nike, Inc. • Portland, Oregon • March 2020 - Present
                  </p>
                  <ul className="mt-2 list-inside list-disc space-y-1 text-gray-600 dark:text-gray-300">
                    <li>
                      Designed and implemented a scalable front-end
                      architecture, streamlining development and maintenance
                      across multiple projects.
                    </li>
                    <li>
                      Automated tech support workflows with custom scripts in
                      PowerShell, Bash, and Node.js, reducing errors and freeing
                      up valuable team resources.
                    </li>
                    <li>
                      Implemented a CI/CD pipeline with Azure and GitHub
                      Actions, reducing complexity and deployment time from
                      hours to just minutes.
                    </li>
                    <li>
                      Developed a Node.js server for remote script execution,
                      enhancing efficient system monitoring and proactive
                      troubleshooting.
                    </li>
                    <li>
                      Converted a myriad of deeply nested documentation
                      structures into an easy to search and easy to maintain web
                      based training and documentation repository.
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-gray-700 dark:text-gray-200">
                    Software Engineer
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    ANSIRA • Portland, Oregon • August 2018 - March 2020
                  </p>
                  <ul className="mt-2 list-inside list-disc space-y-1 text-gray-600 dark:text-gray-300">
                    <li>
                      Collaborated with cross-functional teams to deliver
                      scalable multi-site solutions using a core template.
                    </li>
                    <li>
                      Standardized site migration processes with .bash_profiles,
                      Git pipelines, SSL certificates, and detailed
                      documentation.
                    </li>
                    <li>
                      Improved intern hiring workflows, boosting candidate
                      quality and mentoring new team members.
                    </li>
                    <li>
                      Created technical documentation for clients, enhancing
                      user experience and expediting onboarding.
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Education */}
            <section className="mt-8">
              <h2 className="mb-2 text-xl font-semibold text-gray-800 dark:text-gray-100">
                Education
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-700 dark:text-gray-200">
                    Bachelor of Science in Arts (Multimedia Focus)
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    University of Oregon • Graduated 2009
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    Coursework emphasizing technical design and development
                  </p>
                </div>
              </div>
            </section>

            {/* Skills */}
            <section className="mt-8">
              <h2 className="mb-2 text-xl font-semibold text-gray-800 dark:text-gray-100">
                Skills
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="mb-2 font-medium text-gray-700 dark:text-gray-200">
                    Frontend Development
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-700 dark:bg-gray-700 dark:text-gray-200">
                      HTML
                    </span>
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-700 dark:bg-gray-700 dark:text-gray-200">
                      CSS
                    </span>
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-700 dark:bg-gray-700 dark:text-gray-200">
                      JavaScript
                    </span>
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-700 dark:bg-gray-700 dark:text-gray-200">
                      TypeScript
                    </span>
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-700 dark:bg-gray-700 dark:text-gray-200">
                      React.js
                    </span>
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-700 dark:bg-gray-700 dark:text-gray-200">
                      Redux
                    </span>
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-700 dark:bg-gray-700 dark:text-gray-200">
                      Angular.js
                    </span>
                  </div>
                </div>
                <div>
                  <h3 className="mb-2 font-medium text-gray-700 dark:text-gray-200">
                    Backend/Automation
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-700 dark:bg-gray-700 dark:text-gray-200">
                      Node.js
                    </span>
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-700 dark:bg-gray-700 dark:text-gray-200">
                      PowerShell
                    </span>
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-700 dark:bg-gray-700 dark:text-gray-200">
                      Bash
                    </span>
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-700 dark:bg-gray-700 dark:text-gray-200">
                      C#
                    </span>
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-700 dark:bg-gray-700 dark:text-gray-200">
                      .NET
                    </span>
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-700 dark:bg-gray-700 dark:text-gray-200">
                      Java
                    </span>
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-700 dark:bg-gray-700 dark:text-gray-200">
                      SQL
                    </span>
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-700 dark:bg-gray-700 dark:text-gray-200">
                      NoSQL
                    </span>
                  </div>
                </div>
                <div>
                  <h3 className="mb-2 font-medium text-gray-700 dark:text-gray-200">
                    Development Practices
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-700 dark:bg-gray-700 dark:text-gray-200">
                      CI/CD
                    </span>
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-700 dark:bg-gray-700 dark:text-gray-200">
                      Git pipelines
                    </span>
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-700 dark:bg-gray-700 dark:text-gray-200">
                      Troubleshooting
                    </span>
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-700 dark:bg-gray-700 dark:text-gray-200">
                      Scalable Architecture
                    </span>
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-700 dark:bg-gray-700 dark:text-gray-200">
                      SOLID Principles
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
