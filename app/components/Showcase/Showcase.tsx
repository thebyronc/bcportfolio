import { Link } from "react-router";
import type { ShowcaseProps, ShowcaseItem } from "./types";
import { isValidElement } from "react";
import "./showcase.css";

export function Showcase({ items, title, subtitle, className, children }: ShowcaseProps) {
  const renderItem = (item: ShowcaseItem, index: number) => {
    const content = (
      <div className="items-start gap-4 showcase-container mx-[-16px] px-4 ">
        
        <div className="showcase-text bg-gray-900 p-4 rounded-md mt-4 shadow-xl shadow-gray-300/10">
            <h3 className="font-mono text-medium text-volt-400">Project Showcase</h3>
            <h3 className="text-xl font-bold text-white group-hover:text-volt-400 transition-colors mb-2">
                {item.link ? (
                  item.external ? (
                    <a 
                      href={item.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-volt-400 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {item.title}
                    </a>
                  ) : (
                    <Link 
                      to={item.link}
                      className="hover:text-volt-400 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {item.title}
                    </Link>
                  )
                ) : (
                  item.title
                )}
            </h3>
            <p className="text-zinc-400 text-sm">
                {item.description}
            </p>
             {item.techStack && item.techStack.length > 0 && (
                 <div className="flex flex-wrap gap-4 mt-4">
                     {item.techStack.map((tech, techIndex) => (
                         <span 
                             key={techIndex}
                             className="text-gray-400 text-sm font-mono font-medium"
                         >
                             {tech}
                         </span>
                     ))}
                 </div>
             )}
        </div>

        {item.image && (
           <div className="showcase-image aspect-[4/3] relative overflow-hidden rounded-md border-1 border-zinc-700 group-hover:border-volt-800 transition-all duration-300">
            {typeof item.image === 'string' ? (
              <img
                src={item.image}
                alt={item.imageAlt || item.title}
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-0 grayscale-100
                "
              />
            ) : (
              <div className="absolute inset-0 w-full h-full transition-opacity duration-300 group-hover:opacity-0 flex items-center justify-center grayscale-100">
                {item.image}
              </div>
            )}
            {item.hoverImage && (
              typeof item.hoverImage === 'string' ? (
                <img
                  src={item.hoverImage}
                  alt={item.imageAlt || item.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                />
              ) : (
                <div className="absolute inset-0 w-full h-full opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center">
                  {item.hoverImage}
                </div>
              )
            )}
          </div>
        )}
      </div>
    );

    const baseClasses = "block transition-all border border-transparent bg-zinc-400/0 duration-200 mb-4 hover:border-zinc-400/10 hover:bg-zinc-400/10 rounded-md p-4 group relative mx-[-16px] px-4";

    if (item.onClick) {
      return (
        <button
          key={index}
          onClick={item.onClick}
          className={`${baseClasses} w-full text-left`}
        >
          {content}
        </button>
      );
    }

    if (item.link) {
      if (item.external) {
        return (
          <a
            key={index}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className={baseClasses}
          >
            {content}
          </a>
        );
      }

      return (
        <Link
          key={index}
          to={item.link}
          className={baseClasses}
        >
          {content}
        </Link>
      );
    }

    return (
      <div key={index} className={baseClasses}>
        {content}
      </div>
    );
  };

  return (
    <div className={className}>
      {(title || subtitle) && (
        <header className="mb-8">
          {title && (
            <h2 className="text-2xl font-bold text-zinc-100 mb-2">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-zinc-400">
              {subtitle}
            </p>
          )}
        </header>
      )}
      
      <div className="space-y-0 ">
        {items.map((item, index) => renderItem(item, index))}
      </div>
      
      {children && <div className="mt-6">{children}</div>}
    </div>
  );
}
