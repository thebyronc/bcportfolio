import { Link, useLocation } from "react-router";

export function NavLink({
  href,
  children,
  className,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const location = useLocation();
  const isActive = location.pathname === href;

  return (
    <Link
      to={href}
      onClick={onClick}
      className={
        className ||
        `focus:ring-volt-400 hover:shadow-volt-400/50 hover:bg-volt-400 block cursor-pointer rounded-md px-4 py-2 font-semibold transition-all duration-400 ease-in-out text-shadow-lg hover:text-zinc-950 hover:shadow-lg ${
          isActive ? "underline decoration-2 underline-offset-4" : ""
        }`
      }
    >
      {children}
    </Link>
  );
}
