import "./home.css";
import ListHoverBox from "../../components/ListHoverBox/ListHoverBox";
import { LinkedInIcon, GitHubIcon, GmailIcon } from "../../assets";
import SocialLink from "../../components/SocialLink";
import { useEffect, useState } from "react";
import { Showcase } from "../../components/Showcase/Showcase";
import Rnd0 from "../../assets/images/projects/rnd_0.png";
import Rnd1 from "../../assets/images/projects/rnd_1.png";
import Bsplit0 from "../../assets/images/projects/bsplit_0.png";
const projects = [
    {
        title: "Bill Splitter",
        description: "Split bills and calculate tips with receipt scanning capabilities that leverages the Gemini API for OCR and image processing.",
        image: <img src={Bsplit0} alt="Bill Splitter" />,
        hoverImage: <img src={Bsplit0} alt="Bill Splitter" />,
        link: "/bill-splitter",
        external: false,
        techStack: ["React", "Node.js", "Google Functions", "Gemini API"],
    },
    {
        title: "Random Question Generator",
        description: "Generate random questions for icebreakers, interviews, or fun conversations using the Anime.js library for smooth animations and the Tailwind CSS framework for styling.",
        image: <img src={Rnd0} alt="Random Question Generator" />,
        hoverImage: <img src={Rnd1} alt="Random Question Generator" />,
        link: "/random-question",
        external: false,
        techStack: ["React", "Anime.js", "Tailwind CSS"],
    },
];

export default function Home() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);
    return (
        <div className="relative">
            {/* Spotlight background */}
            {/* Dark mode spotlight */}
            <div 
                className="spotlight-bg fixed inset-0 pointer-events-none z-0 dark:block hidden"
                style={{
                    background: `radial-gradient(1200px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(120, 119, 198, 0.15), transparent 40%)`
                }}
            />
            {/* Light mode spotlight */}
            <div 
                className="spotlight-bg fixed inset-0 pointer-events-none z-0 block dark:hidden"
                style={{
                    background: `radial-gradient(1200px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.08), transparent 40%)`
                }}
            />
            {/* Content */}
            <div className="relative z-1 px-6 py-24 font-sans md:py-24 lg:py-32 flex justify-center">
            <div className="max-w-screen-xl w-full grid grid-cols-1 lg:grid-cols-8 gap-12">
                <div className="px-4 lg:col-span-3 xl:col-span-3">
                    <header className="sticky md:top-24 lg:top-32 lg:max-h-screen">
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-zinc-200 mb-2">Byron Chang</h1>
                        <h2 className="text-lg font-medium text-gray-600 dark:text-zinc-400 mb-4">Front End Engineer</h2>
                        <p className="text-gray-600 dark:text-zinc-400 mb-4">I am a software engineer with a passion for building user-friendly and efficient web applications.</p>
                        <div className="flex gap-4">
                            <SocialLink
                                href="https://www.linkedin.com/in/byronchang"
                                label="LinkedIn Profile"
                                icon={LinkedInIcon}
                            />
                            <SocialLink
                                href="https://github.com/thebyronc"
                                label="GitHub Profile"
                                icon={GitHubIcon}
                            />
                            <SocialLink
                                href="mailto:thebyronc@gmail.com"
                                label="Email thebyronc@gmail.com"
                                icon={GmailIcon}
                                newTab={false}
                            />
                        </div>
                    </header>
                </div>
                <main className="px-4 lg:col-span-5 xl:col-span-5">
                    <section className="mb-16">
                        <h2 className="text-2xl font-bold text-gray-700 dark:text-zinc-400 mb-2">About Me</h2>
                        <p className="text-gray-700 dark:text-zinc-300 mb-2">
                        Senior Front-End Engineer with 8+ years of experience building scalable React and Node.js applications across enterprise platforms.
                            
                        </p>
                        <p className="text-gray-700 dark:text-zinc-300 mb-2">
                        I'm committed to crafting interfaces that empower users through accessible design and robust engineering.  
                        </p>
                        <p className="text-gray-700 dark:text-zinc-300 mb-2">
                            Expert in TypeScript, semantic HTML/CSS, using automation tools to streamline workflows.
                        </p>
                        <p className="text-gray-700 dark:text-zinc-300 mb-2">
                        Led UI development at Nike for global diagnostics platforms, architecting modular systems and deploying to Azure. Passionate about developer experience, testing rigor, and secure, maintainable code. Skilled in CI/CD pipelines, OAuth, and cross-functional collaboration.  
                        </p>
                    </section>
                    
                    <section className="">
                        <ul>
                            <li>
                            <ListHoverBox title="Software Engineer - Nike Inc. (Contractor)" subtitle="Beaverton, Oregon" date="2020 - 2025" skills={["React.js", "TypeScript", "Redux", "C#/.Net", "Azure", "CI/CD", "PowerShell", "Figma"]} items={["Led pixel-perfect UI development for global diagnostics platforms used across Nike's internal teams", "Architected scalable front-end systems using React, TypeScript, and modular UI principles, ARIA roles, improving maintainability across multiple internal platforms.", "Developed C#/.NET backend features to efficiently shape and deliver diagnostic data, contributing to system reliability and performance.", "Deployed diagnostic services and internal tools to Azure, leveraging cloud infrastructure for scalability, security, and streamlined operations.", "Built a Node.js diagnostic server to remotely manage system health and modernize legacy workflow", "Collaborated cross-functionally with designers and PMs to deliver user-centric features with measurable impact on engagement and retention", "Spearheaded DX initiatives including GitHub Actions pipelines and OAuth integrations, reducing deployment friction and onboarding time."]} />
                                
                            </li>
                            <li>
                            <ListHoverBox title="Software Engineer - Ansira" subtitle="Portland, Oregon" date="2018 - 2020" skills={["Vue.js", "Angular.js", "Java/Kotlin", "PHP", "React.js"]} items={["Delivered multi-site front-end solutions using a shared template model and React-based architecture", "Streamlined onboarding with standardized Git workflows, bash environments, and SSL configurations", "Mentored interns and juniors while improving hiring assessments and documentation", "Authored client-facing documentation to clarify technical processes and reduce support escalations."]} />
                            </li>
                        </ul>
                    </section>

                    <section className="">
                        <Showcase items={projects} title="Project Showcase" subtitle="A collection of useful web tools and utilities" />
                    </section>

                </main>
            
            </div>
            </div>
        </div>
    )
}