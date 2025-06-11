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
        className="focus:ring-volt-400 hover:shadow-volt-400/50 hover:bg-volt-400 block rounded-xl px-4 py-2 font-semibold transition-all duration-400 ease-in-out hover:text-zinc-950 hover:shadow-lg"
      >
        {children}
      </a>
    </li>
  );
}
