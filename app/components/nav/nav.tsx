import { NavLink } from "./components/NavLink";
import { useState, useEffect, useRef } from "react";
import type { MouseEvent } from "react";
import byron from "../assets/BYRON.png";

const links = [
  { href: "/", label: "Home" },
  {
    href: "/projects",
    label: "Projects",
    children: [
      { href: "/random-question", label: "Random Question" },
      { href: "/text-compare", label: "Text Compare" },
      { href: "/bill-splitter", label: "Bill Splitter" },
      { href: "/image-to-base64", label: "Image to Base64" },
    ],
  },
  { href: "/contact", label: "Contact" },
];

export function Nav() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
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

  // Hamburger menu icon component
  const HamburgerIcon = () => (
    <button
      onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      className="md:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1"
      aria-label="Toggle mobile menu"
    >
      <span
        className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
          isMobileMenuOpen ? "rotate-45 translate-y-1.5" : ""
        }`}
      />
      <span
        className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
          isMobileMenuOpen ? "opacity-0" : ""
        }`}
      />
      <span
        className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
          isMobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
        }`}
      />
    </button>
  );

  return (
    <nav className="absolute z-10 w-full p-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <img 
            src={byron} 
            alt="BYRON Logo" 
            className="mr-4 h-8 w-auto object-contain" 
            style={{ minWidth: 'auto', maxWidth: 'none' }}
          />
        </div>
        
        {/* Desktop Navigation */}
        <ul className="hidden md:flex justify-start gap-2">
          {links.map((link) => (
            <li key={link.href} className="relative">
              {link.children ? (
                <div ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className={`focus:ring-volt-400 hover:shadow-volt-400/50 hover:bg-volt-400 hover:pointer block cursor-pointer rounded-md px-4 py-2 font-semibold transition-all duration-400 ease-in-out text-shadow-lg hover:text-zinc-950 hover:shadow-lg ${
                      isDropdownOpen ? "bg-volt-400 text-zinc-950" : ""
                    }`}
                    aria-label={link.label}
                    aria-expanded={isDropdownOpen}
                  >
                    {link.label}
                  </button>
                  {isDropdownOpen && (
                    <div className="ring-opacity-5 absolute left-0 mt-2 w-48 rounded-md bg-white shadow-lg ring-1 ring-black dark:bg-neutral-800">
                      <div className="py-1" role="menu">
                        <ul>
                          {link.children.map((childLink) => (
                            <NavLink
                              key={childLink.href}
                              href={childLink.href}
                              className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-700"
                            >
                              {childLink.label}
                            </NavLink>
                          ))}
                        </ul>
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
        
        {/* Mobile Menu Button */}
        <HamburgerIcon />
      </div>
      
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          ref={mobileMenuRef}
          className="md:hidden absolute top-full left-0 right-0 bg-white dark:bg-neutral-800 shadow-lg border-t border-b border-neutral-200 dark:border-neutral-700"
        >
          <div className="px-4 py-2 space-y-1">
            {links.map((link) => (
              <div key={link.href}>
                {link.children ? (
                  <div>
                    <button
                      onClick={() => setIsMobileDropdownOpen(!isMobileDropdownOpen)}
                      className="w-full text-left px-4 py-3 text-lg font-semibold text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-md transition-colors"
                    >
                      {link.label}
                    </button>
                    {isMobileDropdownOpen && (
                      <div className="ml-4 space-y-1">
                        {link.children.map((childLink) => (
                          <NavLink
                            key={childLink.href}
                            href={childLink.href}
                            className="block px-4 py-2 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-md transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {childLink.label}
                          </NavLink>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <NavLink
                    href={link.href}
                    className="block px-4 py-3 text-lg font-semibold text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-md transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </NavLink>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
