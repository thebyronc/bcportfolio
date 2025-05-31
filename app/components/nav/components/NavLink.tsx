export function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <li>
      <a
        href={href}
        className="block p-4 transition-all duration-400 ease-in-out hover:bg-zinc-800 hover:text-teal-500"
      >
        {children}
      </a>
    </li>
  );
}
