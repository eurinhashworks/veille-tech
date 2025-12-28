import React from 'react';
import LandingNav from '../components/landing/LandingNav';
import LandingHero from '../components/landing/LandingHero';
import LandingFeatures from '../components/landing/LandingFeatures';
import LandingTestimonials from '../components/landing/LandingTestimonials';
import LandingPricing from '../components/landing/LandingPricing';
import LandingFAQ from '../components/landing/LandingFAQ';
import LandingFooter from '../components/landing/LandingFooter';

const Landing: React.FC = () => {
    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen font-display transition-colors duration-200 overflow-x-hidden">
            <div className="relative w-full overflow-hidden">
                {/* Background Gradients */}
                <div className="absolute inset-0 z-0 bg-gradient-to-b from-sky-200 via-slate-100 to-white dark:from-slate-900 dark:via-slate-800 dark:to-background-dark opacity-70"></div>

                <div className="relative z-10">
                    <LandingNav />
                    <LandingHero />
                </div>
            </div>

            <LandingFeatures />
            <LandingPricing />
            <LandingTestimonials />
            <LandingFAQ />
            <LandingFooter />
        </div>
    );
};

export default Landing;
