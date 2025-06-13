import { NavLink } from "./components/NavLink";
import { useState, useEffect, useRef } from "react";
import type { MouseEvent } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/contact", label: "Contact" },
];

const toolLinks = [
  { href: "/random-question", label: "Random Question" },
  { href: "/text-compare", label: "Text Compare" },
];

export function Nav() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside as unknown as EventListener,
    );
    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside as unknown as EventListener,
      );
    };
  }, []);

  return (
    <nav className="absolute z-10 w-full p-2">
      <ul className="flex justify-end gap-2">
        {links.map((link) => (
          <li key={link.href} className="relative">
            {link.label === "Projects" ? (
              <div ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={`focus:ring-volt-400 hover:shadow-volt-400/50 hover:bg-volt-400 hover:pointer block cursor-pointer rounded-md px-4 py-2 font-semibold transition-all duration-400 ease-in-out hover:text-zinc-950 hover:shadow-lg ${
                    isDropdownOpen ? "bg-volt-400 text-zinc-950" : ""
                  }`}
                  aria-label="Projects"
                  aria-expanded={isDropdownOpen}
                >
                  {link.label}
                </button>
                {isDropdownOpen && (
                  <div className="ring-opacity-5 absolute right-0 mt-2 w-48 rounded-md bg-white shadow-lg ring-1 ring-black dark:bg-gray-800">
                    <div className="py-1" role="menu">
                      {toolLinks.map((toolLink) => (
                        <NavLink
                          key={toolLink.href}
                          href={toolLink.href}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                        >
                          {toolLink.label}
                        </NavLink>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <NavLink href={link.href}>{link.label}</NavLink>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
