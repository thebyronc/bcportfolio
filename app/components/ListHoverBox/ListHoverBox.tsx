import type { BaseComponentProps } from "../../types";

interface ListHoverBoxProps extends BaseComponentProps {
    title?: string;
    date?: string;
    subtitle?: string;
    items?: string[];
    skills?: string[];
}

export default function ListHoverBox({ title, date, subtitle, items, skills, children }: ListHoverBoxProps) {
    return (
        <div className="list-hover-box transition-all border border-transparent bg-zinc-400/0 duration-200 mb-4 hover:border-zinc-400/10 hover:bg-zinc-400/10 rounded-md p-4 mx-[-16px] group relative grid sm:grid-cols-8 sm:gap-8 md:gap-4">
            <div className="text-base text-zinc-300 font-semibold uppercase sm:col-span-2">{date}</div>
            <div className="gap-4 sm:col-span-6">
                
                <h2 className="text-zinc-100 font-semibold text-lg ">{title}</h2>
                {subtitle && <h3 className="text-zinc-400 font-medium mb-2">{subtitle}</h3>}
                <ul className="text-zinc-300">
                    {items?.map((item, index) => (
                        <li className="mb-2" key={index}>{item}</li>
                    ))}
                </ul>
                <div className="flex flex-wrap gap-2 mt-4">
                    {skills?.map((skill, index) => (
                        <span className="px-3 py-1 bg-volt-600/10 text-volt-200 text-sm rounded-full font-medium" key={index}>
                            {skill}
                        </span>
                    ))}
                </div>
                <p className="text-zinc-300"></p>
                {children && <div>{children}</div>}
            </div>
        </div>

    )
}
