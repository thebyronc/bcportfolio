export function NavLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      className={
        className ||
        "focus:ring-volt-400 hover:shadow-volt-400/50 hover:bg-volt-400 block cursor-pointer rounded-md px-4 py-2 font-semibold transition-all duration-400 ease-in-out hover:text-zinc-950 hover:shadow-lg"
      }
    >
      {children}
    </a>
  );
}
