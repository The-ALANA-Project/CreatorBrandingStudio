import { useState, useEffect } from "react";
import { X } from "lucide-react";

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimatingIn, setIsAnimatingIn] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const cookieConsent = localStorage.getItem("cookieConsent");
    if (!cookieConsent) {
      // Show banner after a short delay for better UX
      setTimeout(() => {
        setIsVisible(true);
        // Trigger slide-in animation
        setTimeout(() => setIsAnimatingIn(true), 50);
      }, 2500); // Delay so it doesn't interfere with intro animation
    } else if (cookieConsent === "accepted") {
      // Enable Google Analytics if previously accepted
      enableGoogleAnalytics();
    }
  }, []);

  const enableGoogleAnalytics = () => {
    // Enable Google Analytics
    if (window.gtag) {
      window.gtag('consent', 'update', {
        'analytics_storage': 'granted'
      });
    }
  };

  const disableGoogleAnalytics = () => {
    // Disable Google Analytics
    if (window.gtag) {
      window.gtag('consent', 'update', {
        'analytics_storage': 'denied'
      });
    }
  };

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "accepted");
    enableGoogleAnalytics();
    closeWithAnimation();
  };

  const handleDecline = () => {
    localStorage.setItem("cookieConsent", "declined");
    disableGoogleAnalytics();
    closeWithAnimation();
  };

  const closeWithAnimation = () => {
    setIsAnimatingIn(false);
    setTimeout(() => {
      setIsVisible(false);
    }, 400);
  };

  if (!isVisible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 transition-all duration-500 ease-out"
      style={{
        transform: `translateY(${isAnimatingIn ? '0' : '100%'})`
      }}
    >
      {/* Liquid glass banner */}
      <div 
        className="relative backdrop-blur-xl border-t shadow-2xl"
        style={{
          background: 'rgba(19, 23, 24, 0.9)',
          borderTop: '1px solid #FEE6EA',
          boxShadow: '0 -8px 32px rgba(0, 0, 0, 0.4), 0 0 60px rgba(254, 230, 234, 0.08)'
        }}
      >
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-6">
            {/* Content */}
            <div className="flex-1">
              <h3 
                className="font-semibold text-sm mb-1"
                style={{ color: '#FEE6EA' }}
              >
                We use cookies
              </h3>
              <p 
                className="text-xs leading-relaxed"
                style={{ color: 'rgba(254, 230, 234, 0.7)' }}
              >
                This site uses Google Analytics to understand how visitors use the app and saves your data locally. No personal information is collected.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleDecline}
                className="px-5 py-2 text-xs font-medium rounded-lg transition-all whitespace-nowrap"
                style={{
                  background: 'rgba(254, 230, 234, 0.1)',
                  border: '1px solid rgba(254, 230, 234, 0.3)',
                  color: '#FEE6EA'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(254, 230, 234, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(254, 230, 234, 0.1)';
                }}
              >
                Decline
              </button>
              <button
                onClick={handleAccept}
                className="px-5 py-2 text-xs font-medium rounded-lg transition-all whitespace-nowrap"
                style={{
                  background: '#FEE6EA',
                  border: '1px solid #FEE6EA',
                  color: '#131718'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#131718';
                  e.currentTarget.style.border = '1px solid #FEE6EA';
                  e.currentTarget.style.color = '#FEE6EA';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#FEE6EA';
                  e.currentTarget.style.border = '1px solid #FEE6EA';
                  e.currentTarget.style.color = '#131718';
                }}
              >
                Accept
              </button>
              <button
                onClick={closeWithAnimation}
                className="p-2 rounded-full transition-all hover:bg-white/10 ml-2"
                style={{ color: '#FEE6EA' }}
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}