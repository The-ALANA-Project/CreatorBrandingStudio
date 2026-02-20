import { Sparkles, Play, ChevronsLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router';

export function StudioHeader() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleReplayIntro = () => {
    // Clear the intro-seen flag and navigate to intro
    sessionStorage.removeItem('intro-seen');
    navigate('/');
  };

  const handleNavigateToResources = () => {
    navigate('/resources');
  };

  const handleBackToStudio = () => {
    navigate('/studio');
  };

  // Determine tagline based on current route
  const tagline = location.pathname === '/resources' 
    ? 'Resources & Experts'
    : 'Your journey to a sharp personal brand';

  const isResourcesPage = location.pathname === '/resources';

  return (
    <header className="sticky top-0 z-50 bg-primary border-b border-primary/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] py-4 sm:py-6">
      <div className="pl-4 pr-4 sm:pl-6 sm:pr-6">
        <div className="flex items-center justify-between">
          {/* Left: Title and tagline */}
          <div className="flex items-center gap-1.5 sm:gap-2">
          
          <div 
            className="flex flex-col cursor-pointer group"
            onClick={() => navigate('/studio')}
          >
            <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-primary-foreground group-hover:text-[#FaFaF9] transition-colors">
              Creator Branding Studio
            </h1>
            <p className="text-xs sm:text-sm text-[#fee6ea] mt-1">
              {tagline}
            </p>
          </div>
          </div>

          {/* Right: Action icons */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Back to Studio Button (only on Resources page) */}
            {isResourcesPage && (
              <button
                onClick={handleBackToStudio}
                className="group relative flex-shrink-0 rounded-full transition-all duration-200 flex items-center justify-center"
                style={{
                  width: 'clamp(2rem, 4vw, 2.5rem)',
                  height: 'clamp(2rem, 4vw, 2.5rem)',
                }}
                title="Back to Studio"
              >
                <ChevronsLeft className="w-5 h-5 text-[#fee6ea] group-hover:text-[#FaFaF9] transition-all group-hover:scale-110" strokeWidth={2.5} />
              </button>
            )}

            {/* Resources Button */}
            <button
              onClick={handleNavigateToResources}
              className="group relative flex-shrink-0 rounded-full transition-all duration-200 flex items-center justify-center"
              style={{
                width: 'clamp(2rem, 4vw, 2.5rem)',
                height: 'clamp(2rem, 4vw, 2.5rem)',
              }}
              title="Resources & Experts"
            >
              <svg 
                className="w-5 h-5 text-[#fee6ea] group-hover:text-[#FaFaF9] transition-all group-hover:scale-110"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </button>

            {/* Replay Intro Button */}
            <button
              onClick={handleReplayIntro}
              className="group relative flex-shrink-0 rounded-full transition-all duration-200 flex items-center justify-center"
              style={{
                width: 'clamp(2rem, 4vw, 2.5rem)',
                height: 'clamp(2rem, 4vw, 2.5rem)',
              }}
              title="Replay Intro Animation"
            >
              <Play className="w-5 h-5 text-[#fee6ea] group-hover:text-[#FaFaF9] transition-all group-hover:scale-110 fill-[#fee6ea] group-hover:fill-[#FaFaF9] rounded-full" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}