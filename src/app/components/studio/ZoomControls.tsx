import { ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { useState, useRef, useEffect } from 'react';

interface ZoomControlsProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
}

export function ZoomControls({ zoom, onZoomIn, onZoomOut, onZoomReset }: ZoomControlsProps) {
  const [position, setPosition] = useState({ x: 0, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; startPosX: number; startPosY: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Set initial position on the right side
  useEffect(() => {
    const updatePosition = () => {
      setPosition({ x: window.innerWidth - 200, y: 100 }); // 200px from right edge
    };
    updatePosition();
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    
    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startPosX: position.x,
      startPosY: position.y,
    };
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !dragRef.current) return;

    const deltaX = e.clientX - dragRef.current.startX;
    const deltaY = e.clientY - dragRef.current.startY;

    setPosition({
      x: Math.max(0, Math.min(window.innerWidth - 180, dragRef.current.startPosX + deltaX)),
      y: Math.max(0, Math.min(window.innerHeight - 60, dragRef.current.startPosY + deltaY)),
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    dragRef.current = null;
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  return (
    <div 
      ref={containerRef}
      className="fixed z-30 select-none"
      style={{ 
        left: `${position.x}px`, 
        top: `${position.y}px`,
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Add padding wrapper for larger drag area */}
      <div className="p-2">
        {/* Liquid Glass Wrapper */}
        <div className="relative flex overflow-hidden rounded-2xl shadow-[0_6px_6px_rgba(0,0,0,0.2),0_0_20px_rgba(0,0,0,0.1)] transition-all duration-[400ms] ease-[cubic-bezier(0.175,0.885,0.32,2.2)] hover:shadow-[0_8px_8px_rgba(0,0,0,0.25),0_0_24px_rgba(0,0,0,0.15)]">
          {/* Glass Effect Layer */}
          <div 
            className="absolute inset-0 z-0 overflow-hidden pointer-events-none"
            style={{
              backdropFilter: 'blur(3px)',
              filter: 'url(#glass-distortion)',
              isolation: 'isolate',
            }}
          />
          
          {/* Tint Layer */}
          <div 
            className="absolute inset-0 z-[1] pointer-events-none"
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
            }}
          />
          
          {/* Shine Layer */}
          <div 
            className="absolute inset-0 z-[2] overflow-hidden pointer-events-none"
            style={{
              boxShadow: 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.4)',
            }}
          />
          
          {/* Content Layer */}
          <div className="relative z-[3] flex flex-row">
            <Button
              onClick={onZoomOut}
              variant="ghost"
              size="sm"
              className="w-12 h-10 p-0 text-foreground/90 hover:text-foreground hover:bg-white/30 hover:shadow-[inset_-2px_-2px_2px_rgba(0,0,0,0.1)] hover:backdrop-blur-[2px] rounded-none border-r border-black/10 transition-all duration-100"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <Button
              onClick={onZoomReset}
              variant="ghost"
              size="sm"
              className="w-16 h-10 p-0 text-foreground/90 hover:text-foreground hover:bg-white/30 hover:shadow-[inset_-2px_-2px_2px_rgba(0,0,0,0.1)] hover:backdrop-blur-[2px] rounded-none border-r border-black/10 transition-all duration-100"
              title="Reset Zoom"
            >
              <span className="text-xs font-semibold">{Math.round(zoom * 100)}%</span>
            </Button>
            <Button
              onClick={onZoomIn}
              variant="ghost"
              size="sm"
              className="w-12 h-10 p-0 text-foreground/90 hover:text-foreground hover:bg-white/30 hover:shadow-[inset_-2px_-2px_2px_rgba(0,0,0,0.1)] hover:backdrop-blur-[2px] rounded-none transition-all duration-100"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}