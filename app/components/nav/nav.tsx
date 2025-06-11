import { NavLink } from "./components/NavLink";

const links = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/random-question", label: "RDM Q" },
  { href: "/contact", label: "Contact" },
];
export function Nav() {
  return (
    <nav className="absolute z-10 w-full p-2">
      <ul className="flex justify-end gap-2">
        {links.map((link) => (
          <NavLink key={link.href} href={link.href}>
            {link.label}
          </NavLink>
        ))}
      </ul>
    </nav>
  );
}
