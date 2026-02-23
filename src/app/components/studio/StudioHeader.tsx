import { ChevronsLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router';

export function StudioHeader() {
  const navigate = useNavigate();
  const location = useLocation();

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
          
          <div className="flex flex-col">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-primary-foreground">
              Creator Branding Studio
            </h1>
            <p className="text-xs sm:text-sm text-[#fee6ea] mt-1">
              {tagline}
            </p>
          </div>
          </div>

          {/* Right: Action icons - empty for now */}
          <div className="flex items-center gap-3 sm:gap-4">
          </div>
        </div>
      </div>
    </header>
  );
}