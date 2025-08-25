// components/IntersectionLazyLoader.jsx
'use client';

import { useState, useEffect, useRef } from 'react';

export default function IntersectionLazyLoader({ 
  children, 
  rootMargin = "200px",
  threshold = 0.1,
  className = "",
  fallbackHeight = "300px"
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasBeenVisible) {
          setIsVisible(true);
          setHasBeenVisible(true);
          // Once loaded, we don't need to observe anymore
          observer.unobserve(entry.target);
        }
      },
      {
        rootMargin,
        threshold,
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [rootMargin, threshold, hasBeenVisible]);

  return (
    <div ref={ref} className={className}>
      {isVisible ? (
        children
      ) : (
        // Placeholder to maintain layout
        <div 
          className="flex items-center justify-center bg-gray-50/30 animate-pulse"
          style={{ minHeight: fallbackHeight }}
        >
          <div className="text-gray-400 text-sm">Loading section...</div>
        </div>
      )}
    </div>
  );
}