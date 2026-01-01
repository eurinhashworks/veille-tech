"use client";

import React, { useEffect } from 'react';
import AboutHero from '@/components/about/AboutHero';
import AboutFeatures from '@/components/about/AboutFeatures';
import AboutSolutions from '@/components/about/AboutSolutions';
import AboutIntegrations from '@/components/about/AboutIntegrations';
import AboutInfoNav from '@/components/about/AboutInfoNav';
import LandingFooter from '@/components/landing/LandingFooter';
import LandingNav from '@/components/landing/LandingNav';

const About: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen font-display transition-colors duration-200 overflow-x-hidden font-sans">
      <div className="relative w-full overflow-hidden">
        {/* Background Gradients Match Landing */}
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-sky-200 via-slate-100 to-white dark:from-slate-900 dark:via-slate-800 dark:to-background-dark opacity-70"></div>

        <div className="relative z-10">
          <LandingNav />
          <AboutHero />
        </div>
      </div>

      <main className="relative z-10">
        <div id="how-it-works">
          <AboutFeatures />
        </div>
        <AboutSolutions />
        <AboutIntegrations />
        <AboutInfoNav />
      </main>
      <LandingFooter />
    </div>
  );
};
export default About;
