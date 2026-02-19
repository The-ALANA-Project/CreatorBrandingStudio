import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { motion, AnimatePresence } from 'motion/react';
import { StepGoals } from './steps/StepGoals';
import { StepVibeCheck } from './steps/StepVibeCheck';
import { StepArchetype } from './steps/StepArchetype';
import { StepMotivations } from './steps/StepMotivations';
import { StepVisualLab } from './steps/StepVisualLab';
import { StepTypography } from './steps/StepTypography';
import { StepColorMapping } from './steps/StepColorMapping';
import { StepDesignElements } from './steps/StepDesignElements';
import { StepInspiration } from './steps/StepInspiration';
import { StepNextSteps } from './steps/StepNextSteps';
import type { CanvasItem, JourneyData } from '@/app/pages/Studio';
import { useState, useRef, useEffect } from 'react';

interface StudioDrawerProps {
  isOpen: boolean;
  onToggle: () => void;
  currentStep: number;
  highestUnlockedStep: number;
  onStepChange: (step: number) => void;
  onAddItem: (item: Omit<CanvasItem, 'id' | 'position'>) => void;
  onAddItemsVertical: (items: Omit<CanvasItem, 'id' | 'position'>[]) => void;
  onAddItemsHorizontal: (items: Omit<CanvasItem, 'id' | 'position'>[]) => void;
  onStepComplete: () => void;
  onToggleDevMode: () => void;
  devMode: boolean;
  journeyData: JourneyData;
  onUpdateJourneyData: (stepKey: string, data: any) => void;
}

const steps = [
  { number: 1, title: 'Goals Check', component: StepGoals },
  { number: 2, title: 'Vibe Check', component: StepVibeCheck },
  { number: 3, title: 'Your Archetype', component: StepArchetype },
  { number: 4, title: 'Core Motivations', component: StepMotivations },
  { number: 5, title: 'Visual Lab', component: StepVisualLab },
  { number: 6, title: 'Typography', component: StepTypography },
  { number: 7, title: 'Color Lab', component: StepColorMapping },
  { number: 8, title: 'Inspiration', component: StepInspiration },
  { number: 9, title: 'Design Principles', component: StepDesignElements },
  { number: 10, title: 'Next Steps', component: StepNextSteps },
];

const MIN_HEIGHT = 200; // Minimum drawer height in pixels
const DEFAULT_HEIGHT_VH = 30; // Default drawer height as percentage of viewport
const HEADER_HEIGHT = 80; // Header height in pixels - drawer cannot go above this

export function StudioDrawer({
  isOpen,
  onToggle,
  currentStep,
  highestUnlockedStep,
  onStepChange,
  onAddItem,
  onAddItemsVertical,
  onAddItemsHorizontal,
  onStepComplete,
  onToggleDevMode,
  devMode,
  journeyData,
  onUpdateJourneyData,
}: StudioDrawerProps) {
  const CurrentStepComponent = steps[currentStep - 1]?.component;
  const [drawerHeight, setDrawerHeight] = useState(DEFAULT_HEIGHT_VH);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartY = useRef(0);
  const dragStartHeight = useRef(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Get actual header height dynamically
  const getHeaderHeight = () => {
    const header = document.querySelector('header');
    return header ? header.offsetHeight : 80;
  };

  // Get the handle height dynamically
  const getHandleHeight = () => {
    return handleRef.current ? handleRef.current.offsetHeight : 44;
  };

  // Reset scroll to top when step changes
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentStep]);

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    dragStartY.current = clientY;
    dragStartHeight.current = drawerHeight;
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleDragMove = (e: MouseEvent | TouchEvent) => {
      const clientY = 'touches' in e ? (e as TouchEvent).touches[0].clientY : (e as MouseEvent).clientY;
      const deltaY = dragStartY.current - clientY; // Positive when dragging up
      const viewportHeight = window.innerHeight;
      const deltaVh = (deltaY / viewportHeight) * 100;
      
      // Get actual heights
      const headerHeight = getHeaderHeight();
      const handleHeight = getHandleHeight();
      
      // CRITICAL: The drawer content height must account for BOTH header AND handle
      // Total drawer = handle + content
      // Available space = viewport - header
      // So max content = viewport - header - handle
      const maxContentHeight = ((viewportHeight - headerHeight - handleHeight) / viewportHeight) * 100;
      
      // Debug logging
      console.log('🔍 Drawer drag debug:', {
        viewportHeight,
        headerHeight,
        handleHeight,
        maxContentHeight: maxContentHeight.toFixed(2) + 'vh',
        currentHeight: (dragStartHeight.current + deltaVh).toFixed(2) + 'vh',
      });
      
      const newHeight = Math.min(
        maxContentHeight, // Content height limit so total drawer doesn't exceed available space
        Math.max(
          (MIN_HEIGHT / viewportHeight) * 100,
          dragStartHeight.current + deltaVh
        )
      );
      
      setDrawerHeight(newHeight);
    };

    const handleDragEnd = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('mouseup', handleDragEnd);
    document.addEventListener('touchmove', handleDragMove);
    document.addEventListener('touchend', handleDragEnd);

    return () => {
      document.removeEventListener('mousemove', handleDragMove);
      document.removeEventListener('mouseup', handleDragEnd);
      document.removeEventListener('touchmove', handleDragMove);
      document.removeEventListener('touchend', handleDragEnd);
    };
  }, [isDragging]);

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 z-40"
      data-drawer="true"
      initial={false}
      animate={{ y: isOpen ? 0 : 'calc(100% - 44px)' }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
    >
      {/* Drawer Handle - Off-black with drag functionality */}
      <div 
        className={`bg-[#131718] shadow-[0_-8px_32px_0_rgba(0,0,0,0.1)] rounded-t-[10px] ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onMouseDown={handleDragStart}
        onTouchStart={handleDragStart}
        ref={handleRef}
        data-drawer-handle
      >
        <div className="w-full py-3 px-4 flex items-center justify-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
          >
            {isOpen ? (
              <ChevronDown className="w-5 h-5 text-white/70" />
            ) : (
              <ChevronUp className="w-5 h-5 text-white/70" />
            )}
            <span className="text-sm text-white/90 font-medium">
              {isOpen ? 'Minimize to Pause Journey' : 'Expand to Start/Continue Journey'}
            </span>
          </button>
        </div>
      </div>

      {/* Drawer Content - Original pink */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ 
              opacity: 1, 
              height: `${drawerHeight}vh`,
            }}
            exit={{ opacity: 0, height: 0 }}
            transition={
              isDragging 
                ? { type: 'tween', duration: 0 } // Instant during drag
                : { type: 'spring', damping: 30, stiffness: 300 } // Smooth when released
            }
            className="bg-[#FEE6EA] flex flex-col"
          >
            {/* Dev Mode Button */}
            <div className="px-4 py-2 sm:px-6 border-b border-[#131718] flex-shrink-0">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleDevMode();
                }}
                className={`
                  px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                  ${
                    devMode
                      ? 'bg-green-500/20 text-green-700 border border-green-500/30'
                      : 'bg-muted/30 text-muted-foreground border border-border/50 hover:bg-muted/50'
                  }
                `}
              >
                {devMode ? 'DEV MODE: ON (All Unlocked)' : 'DEV MODE: OFF'}
              </button>
            </div>

            {/* Step Tabs */}
            <div className="border-b border-[#131718] overflow-x-auto flex-shrink-0">
              <div className="flex gap-1 px-4 py-2 sm:px-6 min-w-max">
                {steps.map((step) => {
                  const isUnlocked = step.number <= highestUnlockedStep;
                  const isActive = currentStep === step.number;
                  
                  return (
                    <button
                      key={step.number}
                      onClick={() => onStepChange(step.number)}
                      disabled={!isUnlocked}
                      className={`
                        flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                        ${
                          isActive
                            ? 'bg-primary text-primary-foreground shadow-md'
                            : isUnlocked
                            ? 'bg-muted/50 text-muted-foreground hover:bg-muted cursor-pointer'
                            : 'bg-muted/20 text-muted-foreground/40 cursor-not-allowed opacity-50'
                        }
                      `}
                      title={!isUnlocked ? 'Complete previous steps to unlock' : ''}
                    >
                      <span className="hidden sm:inline">{step.title}</span>
                      <span className="sm:hidden">{step.number}</span>
                      {!isUnlocked && (
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" className="opacity-50">
                          <path d="M6 0C4.34315 0 3 1.34315 3 3V4H2C1.44772 4 1 4.44772 1 5V10C1 10.5523 1.44772 11 2 11H10C10.5523 11 11 10.5523 11 10V5C11 4.44772 10.5523 4 10 4H9V3C9 1.34315 7.65685 0 6 0ZM7.5 3V4H4.5V3C4.5 2.17157 5.17157 1.5 6 1.5C6.82843 1.5 7.5 2.17157 7.5 3Z"/>
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step Content with dynamic height and scroll */}
            <div 
              className="overflow-y-auto flex-1 min-h-0"
              ref={scrollContainerRef}
              data-scroll-container
            >
              <div className="px-4 py-6 sm:px-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {CurrentStepComponent && (
                      <CurrentStepComponent
                        onAddItem={onAddItem}
                        onAddItemsVertical={onAddItemsVertical}
                        onAddItemsHorizontal={onAddItemsHorizontal}
                        onNext={onStepComplete}
                        journeyData={journeyData}
                        onUpdateJourneyData={onUpdateJourneyData}
                      />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}