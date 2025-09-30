interface ListHoverBoxProps {
    title?: string;
    date?: string;
    subtitle?: string;
    items?: string[];
    skills?: string[];
    children?: React.ReactNode;
}

export default function ListHoverBox({ title, date, subtitle, items,skills,  children }: ListHoverBoxProps) {
    return (
        <div className="border-1 border-transparent mb-4 hover:border-zinc-600 hover:bg-zinc-400/10 rounded-md p-4 mx-[-16px] group relative grid transition-all sm:grid-cols-8 sm:gap-8 md:gap-4">
            <div className="text-md text-zinc-300 font-semibold uppercase sm:col-span-2">{date}</div>
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
                        <span className="px-3 py-1 bg-volt-600/20 text-volt-200 text-sm rounded-full font-medium" key={index}>
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