import { Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router';

export function StudioHeader() {
  const navigate = useNavigate();

  const handleReplayIntro = () => {
    // Clear the intro-seen flag and navigate to intro
    sessionStorage.removeItem('intro-seen');
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-primary border-b border-primary/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] py-4 sm:py-6">
      <div className="pl-4 pr-4 sm:pl-6 sm:pr-6">
        <div className="flex items-end justify-between">
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Replay Intro Button - Styled as subtle circle */}
            <button
              onClick={handleReplayIntro}
              className="group relative flex-shrink-0 rounded-full transition-all duration-200 flex items-center justify-center"
              style={{
                width: 'clamp(1rem, 2vw, 1.5rem)',
                height: 'clamp(1rem, 2vw, 1.5rem)',
                border: '2px solid #fee6ea'
              }}
              title="Replay Intro Animation"
            >
              <div 
                className="rounded-full bg-[#fee6ea] opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                style={{
                  width: '40%',
                  height: '40%'
                }}
              />
            </button>
            
            <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-primary-foreground">
              Creator Branding Studio
            </h1>
          </div>
          
          <div className="text-xs sm:text-sm text-[#fee6ea]">
            Your journey to a sharp personal brand
          </div>
        </div>
      </div>
    </header>
  );
}