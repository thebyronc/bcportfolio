import React, { useState, useRef, useEffect } from "react";

interface AccordionProps {
  header: React.ReactNode;
  children: React.ReactNode;
  isOpen?: boolean;
  onToggle?: () => void;
  className?: string;
  defaultOpen?: boolean;
}

const Accordion: React.FC<AccordionProps> = ({
  header,
  children,
  isOpen: controlledIsOpen,
  onToggle,
  className = "",
  defaultOpen = false,
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(defaultOpen);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number | undefined>(undefined);

  // Use controlled state if provided, otherwise use internal state
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;

  const handleToggle = () => {
    if (onToggle) {
      onToggle();
    } else {
      setInternalIsOpen(!internalIsOpen);
    }
  };

  // Update content height when children change
  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [children]);

  return (
    <div className={`border border-zinc-600 rounded-md ${className}`}>
      {/* Header */}
      <button
        className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-zinc-700 transition-colors focus:outline-none focus:ring-2 focus:ring-volt-400 focus:ring-inset gap-2"
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-controls="accordion-content"
      >
        <div className="flex-1">{header}</div>
        <div className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Content */}
      <div
        id="accordion-content"
        className="overflow-hidden transition-all duration-200 ease-in-out"
        style={{
          height: isOpen ? (contentHeight ? `${contentHeight}px` : 'auto') : '0px',
        }}
      >
        <div ref={contentRef} className="px-4 pb-3">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Accordion;