import { useState, useEffect } from 'react';

interface UseActiveSectionOptions {
  threshold?: number;
  rootMargin?: string;
}

export function useActiveSection(
  sectionIds: string[],
  options: UseActiveSectionOptions = {}
) {
  const [activeSection, setActiveSection] = useState<string>('');

  const { threshold = 0.3, rootMargin = '0px 0px -50% 0px' } = options;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Find the entry with the highest intersection ratio
        let maxRatio = 0;
        let currentActive = '';

        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio;
            currentActive = entry.target.id;
          }
        });

        // Only update if we found a section that meets the threshold
        if (currentActive && maxRatio >= threshold) {
          setActiveSection(currentActive);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    // Observe all sections
    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [sectionIds, threshold, rootMargin]);

  return activeSection;
}
