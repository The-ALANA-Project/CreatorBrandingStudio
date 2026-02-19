import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import gsap from 'gsap';

export default function Intro() {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const tubeRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLHeadingElement>(null);
  const line2Ref = useRef<HTMLHeadingElement>(null);
  const line3Ref = useRef<HTMLHeadingElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  // Check if user has already seen intro - if so, redirect to studio
  useEffect(() => {
    const introSeen = sessionStorage.getItem('intro-seen');
    if (introSeen === 'true') {
      navigate('/studio', { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    // Make container visible
    if (!containerRef.current) return;
    
    gsap.set(containerRef.current, { visibility: 'visible' });

    const lines = [line1Ref.current, line2Ref.current, line3Ref.current];
    
    // Check if all refs are available
    if (!lines.every(line => line !== null)) return;
    
    // Split into three lines
    const textLines = ['Creator', 'Branding', 'Studio'];

    // Manually split text into characters for each line
    const splitLines = lines.map((line, lineIndex) => {
      if (!line) return null;
      
      const text = textLines[lineIndex];
      const chars = text.split('');
      line.innerHTML = chars.map(char => 
        `<span class="char" style="display: inline-block; backface-visibility: hidden;">${char}</span>`
      ).join('');
      
      return line.querySelectorAll('.char');
    });

    // Store timeline reference for cleanup
    let tl: gsap.core.Timeline | null = null;

    // CRITICAL FIX: Wait for browser to complete layout/render before applying 3D transforms
    // This ensures the innerHTML changes are fully processed
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        // 3D setup
        const width = window.innerWidth;
        const depth = -width / 8;
        const transformOrigin = `50% 50% ${depth}px`;

        gsap.set(lines, { 
          perspective: 700, 
          transformStyle: 'preserve-3d' 
        });

        // Show CTA after animation intro (only if ctaRef is available)
        if (ctaRef.current) {
          gsap.to(ctaRef.current, {
            opacity: 1,
            y: 0,
            duration: 1,
            delay: 2,
            ease: 'power2.out'
          });
        }

        // Timeline animation - with seamless looping
        tl = gsap.timeline({ repeat: -1 });

        // Animate each line independently with character stagger
        splitLines.forEach((chars, index) => {
          if (!chars || !tl) return;
          
          tl.fromTo(
            Array.from(chars),
            { rotationX: -90 },
            { 
              rotationX: 270, // Full 360 rotation
              stagger: 0.12, // Character-by-character stagger effect
              duration: 2.5, // Slower for better readability
              ease: 'none',
              transformOrigin,
              onUpdate: function() {
                // Hide characters when they're on the back side (90 to 270 degrees)
                Array.from(chars).forEach((char: Element) => {
                  const element = char as HTMLElement;
                  const rotation = gsap.getProperty(element, 'rotationX') as number;
                  
                  // Normalize rotation to 0-360 range
                  const normalizedRotation = ((rotation % 360) + 360) % 360;
                  
                  // Hide when rotation is between 90 and 270 (back half)
                  if (normalizedRotation > 90 && normalizedRotation < 270) {
                    element.style.opacity = '0';
                  } else {
                    element.style.opacity = '1';
                  }
                });
              }
            },
            index * 0.75 // Adjusted offset for even spacing
          );
        });
      });
    });

    // Cleanup function
    return () => {
      if (tl) {
        tl.kill();
      }
    };
  }, []);

  const handleBeginJourney = () => {
    sessionStorage.setItem('intro-seen', 'true');
    sessionStorage.setItem('intro-transitioning', 'true'); // Flag for Studio to fade in
    
    if (!containerRef.current) {
      // If ref is not available, navigate immediately
      navigate('/studio');
      return;
    }
    
    const tl = gsap.timeline({
      onComplete: () => navigate('/studio')
    });

    // Liquid glass dissolve: blur and fade out with scale - LONGER and SMOOTHER
    tl.to(containerRef.current, {
      opacity: 0,
      filter: 'blur(50px)',
      scale: 1.08,
      duration: 1.4, // Increased from 0.9 to 1.4 seconds
      ease: 'power1.inOut' // Smoother easing
    });
  };

  return (
    <div 
      ref={containerRef} 
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ 
        backgroundColor: '#131718',
        visibility: 'hidden'
      }}
    >
      {/* Rolling Text Animation */}
      <div 
        ref={tubeRef} 
        className="relative w-full flex flex-col items-center justify-center"
        style={{ height: '40vw' }}
      >
        <h1 
          ref={line1Ref}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 m-0 whitespace-nowrap text-center"
          style={{
            lineHeight: 1.2,
            letterSpacing: '-0.4vw',
            fontSize: '16vw',
            color: '#FEE6EA',
            backfaceVisibility: 'hidden',
            willChange: 'transform'
          }}
        >
          Creator
        </h1>
        <h1 
          ref={line2Ref}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 m-0 whitespace-nowrap text-center"
          style={{
            lineHeight: 1.2,
            letterSpacing: '-0.4vw',
            fontSize: '16vw',
            color: '#FEE6EA',
            backfaceVisibility: 'hidden',
            willChange: 'transform'
          }}
        >
          Branding
        </h1>
        <h1 
          ref={line3Ref}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 m-0 whitespace-nowrap text-center"
          style={{
            lineHeight: 1.2,
            letterSpacing: '-0.4vw',
            fontSize: '16vw',
            color: '#FEE6EA',
            backfaceVisibility: 'hidden',
            willChange: 'transform'
          }}
        >
          Studio
        </h1>
      </div>

      {/* CTA Button */}
      <div 
        ref={ctaRef} 
        className="mt-12 mb-32 opacity-0"
        style={{ transform: 'translateY(20px)' }}
      >
        <button
          onClick={handleBeginJourney}
          className="relative overflow-hidden rounded-full px-12 py-4 text-lg font-semibold transition-all hover:scale-105 active:scale-95"
          style={{
            background: '#131718',
            color: '#FEE6EA',
            border: '1px solid #FEE6EA',
            boxShadow: '0 0 30px rgba(254, 230, 234, 0.3), 0 0 60px rgba(254, 230, 234, 0.15)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(254, 230, 234, 0.9)';
            e.currentTarget.style.color = '#131718';
            e.currentTarget.style.boxShadow = 'none';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#131718';
            e.currentTarget.style.color = '#FEE6EA';
            e.currentTarget.style.boxShadow = '0 0 30px rgba(254, 230, 234, 0.3), 0 0 60px rgba(254, 230, 234, 0.15)';
          }}
        >
          Begin Your Journey
        </button>
      </div>
    </div>
  );
}