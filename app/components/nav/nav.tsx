import { NavLink } from "./components/NavLink";

const links = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/contact", label: "Contact" },
];
export function Nav() {
  return (
    <nav>
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
