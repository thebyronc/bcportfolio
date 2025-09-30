interface ListHoverBoxProps {
  title?: string;
  date?: string;
  subtitle?: string;
  items?: string[];
  skills?: string[];
  children?: React.ReactNode;
}

export default function ListHoverBox({
  title,
  date,
  subtitle,
  items,
  skills,
  children,
}: ListHoverBoxProps) {
  return (
    <div className="group relative mx-[-16px] mb-4 grid rounded-md border-1 border-transparent p-4 transition-all hover:border-zinc-600 hover:bg-zinc-400/10 sm:grid-cols-8 sm:gap-8 md:gap-4">
      <div className="text-md font-semibold text-zinc-300 uppercase sm:col-span-2">
        {date}
      </div>
      <div className="gap-4 sm:col-span-6">
        <h2 className="text-lg font-semibold text-zinc-100">{title}</h2>
        {subtitle && (
          <h3 className="mb-2 font-medium text-zinc-400">{subtitle}</h3>
        )}
        <ul className="text-zinc-300">
          {items?.map((item, index) => (
            <li className="mb-2" key={index}>
              {item}
            </li>
          ))}
        </ul>
        <div className="mt-4 flex flex-wrap gap-2">
          {skills?.map((skill, index) => (
            <span
              className="bg-volt-600/20 text-volt-200 rounded-full px-3 py-1 text-sm font-medium"
              key={index}
            >
              {skill}
            </span>
          ))}
        </div>
        <p className="text-zinc-300"></p>
        {children && <div>{children}</div>}
      </div>
    </div>
  );
}
