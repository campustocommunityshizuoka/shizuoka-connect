"use client";

import { useEffect } from 'react';

export default function ScrollObserver() {
  useEffect(() => {
    const fadeElements = document.querySelectorAll('.fade-in, .section-title');
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    fadeElements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return null; // UIは持ちません
}