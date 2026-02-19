import { useRef, useState, useCallback, useEffect } from 'react';
import { useDrop } from 'react-dnd';
import { DraggableCanvasItem } from './DraggableCanvasItem';
import type { CanvasItem } from '@/app/pages/Studio';
import { Home, ZoomIn, ZoomOut, Download, Upload, FileJson, FileImage, FileText, Trash2, Type, StickyNote, Square, Pipette } from 'lucide-react';

interface CanvasProps {
  items: CanvasItem[];
  onUpdatePosition: (id: string, position: { x: number; y: number }) => void;
  onUpdateContent: (id: string, content: any) => void;
  onRemoveItem: (id: string) => void;
  onAddItem?: (item: Omit<CanvasItem, 'id' | 'position'>, position: { x: number; y: number }) => void;
  zoom?: number;
  onDownloadProgress?: () => void;
  onUploadProgress?: () => void;
  onExportPNG?: () => void;
  onExportPDF?: () => void;
  onClearCanvas?: () => void;
  onClearAll?: () => void;
}

export function Canvas({ items, onUpdatePosition, onUpdateContent, onRemoveItem, onAddItem, zoom = 1, onDownloadProgress, onUploadProgress, onExportPNG, onExportPDF, onClearCanvas, onClearAll }: CanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [showUploadMenu, setShowUploadMenu] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#FEE6EA');
  const downloadMenuRef = useRef<HTMLDivElement>(null);
  const uploadMenuRef = useRef<HTMLDivElement>(null);
  const clearMenuRef = useRef<HTMLDivElement>(null);
  const colorPickerRef = useRef<HTMLDivElement>(null);

  // Snap to grid helper function (24px grid)
  const snapToGrid = (x: number, y: number) => {
    const gridSize = 12; // Tighter grid for easier positioning
    // Snap to grid intersections (dots are at 0, 12, 24, etc.)
    return {
      x: Math.round(x / gridSize) * gridSize,
      y: Math.round(y / gridSize) * gridSize,
    };
  };

  // Handle mouse wheel for zooming
  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = -e.deltaY;
      const zoomSensitivity = 0.001;
      const newScale = Math.min(Math.max(0.1, scale + delta * zoomSensitivity), 3);
      setScale(newScale);
    }
  }, [scale]);

  // Handle mouse down for panning
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // Only pan if clicking on the canvas background (not on items)
    const target = e.target as HTMLElement;
    if (target.hasAttribute('data-canvas') || target.closest('[data-canvas]')) {
      // Check if we're not clicking on a canvas item
      if (!target.closest('[data-canvas-item]')) {
        setIsPanning(true);
        setStartPan({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      }
    }
  }, [pan]);

  // Handle mouse move for panning
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isPanning) {
      setPan({
        x: e.clientX - startPan.x,
        y: e.clientY - startPan.y,
      });
    }
  }, [isPanning, startPan]);

  // Handle mouse up to stop panning
  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  // Reset view to center
  const resetView = useCallback(() => {
    setPan({ x: 0, y: 0 });
    setScale(1);
  }, []);

  // Zoom in/out controls
  const zoomIn = useCallback(() => {
    setScale(prev => Math.min(prev + 0.2, 3));
  }, []);

  const zoomOut = useCallback(() => {
    setScale(prev => Math.max(prev - 0.2, 0.1));
  }, []);

  // Handle image upload
  const handleUploadImage = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const imageUrl = event.target?.result as string;
          if (imageUrl && onAddItem) {
            // Add image to center of current view
            const centerX = (window.innerWidth / 2 - pan.x) / scale;
            const centerY = (window.innerHeight / 2 - pan.y) / scale;
            const snapped = snapToGrid(centerX, centerY);
            
            onAddItem({
              type: 'image',
              content: {
                url: imageUrl,
                alt: file.name,
              },
            }, snapped);
          }
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
    setShowUploadMenu(false);
  }, [onAddItem, pan, scale, snapToGrid]);

  // Add Title handler
  const handleAddTitle = useCallback(() => {
    if (onAddItem) {
      const centerX = (window.innerWidth / 2 - pan.x) / scale;
      const centerY = (window.innerHeight / 2 - pan.y) / scale;
      const snapped = snapToGrid(centerX, centerY);
      
      onAddItem({
        type: 'text',
        content: {
          text: 'Title',
          isTitle: true,
        },
      }, snapped);
    }
  }, [onAddItem, pan, scale, snapToGrid]);

  // Add Note handler
  const handleAddNote = useCallback(() => {
    if (onAddItem) {
      const centerX = (window.innerWidth / 2 - pan.x) / scale;
      const centerY = (window.innerHeight / 2 - pan.y) / scale;
      const snapped = snapToGrid(centerX, centerY);
      
      onAddItem({
        type: 'text',
        content: {
          text: 'Note',
          isTitle: false,
        },
      }, snapped);
    }
  }, [onAddItem, pan, scale, snapToGrid]);

  // Add Color Card handler
  const handleAddColorCard = useCallback(() => {
    if (onAddItem) {
      const centerX = (window.innerWidth / 2 - pan.x) / scale;
      const centerY = (window.innerHeight / 2 - pan.y) / scale;
      const snapped = snapToGrid(centerX, centerY);
      
      onAddItem({
        type: 'color',
        content: {
          color: selectedColor,
          label: 'Color',
        },
      }, snapped);
    }
  }, [onAddItem, pan, scale, snapToGrid, selectedColor]);

  // Pick Color handler
  const handlePickColor = useCallback((color: string) => {
    setSelectedColor(color);
    setShowColorPicker(false);
  }, []);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: ['CARD', 'IMAGE', 'TEXT', 'COLOR', 'FONT_PAIRING', 'TYPOGRAPHY'],
    drop: (item: any, monitor) => {
      const delta = monitor.getDifferenceFromInitialOffset();
      const canvasRect = canvasRef.current?.getBoundingClientRect();
      
      if (canvasRect) {
        // Handle color drop
        if (item.color && item.label) {
          const offset = monitor.getClientOffset();
          if (offset) {
            const rawX = (offset.x - canvasRect.left - pan.x) / scale;
            const rawY = (offset.y - canvasRect.top - pan.y) / scale;
            const { x, y } = snapToGrid(rawX, rawY);
            
            const newItem: Omit<CanvasItem, 'id' | 'position'> = {
              type: 'color',
              content: {
                color: item.color,
                label: item.label,
              },
            };
            
            if (onAddItem) {
              onAddItem(newItem, { x, y });
            }
          }
        }
        // Handle typography drop
        else if (item.font) {
          const offset = monitor.getClientOffset();
          if (offset) {
            const rawX = (offset.x - canvasRect.left - pan.x) / scale;
            const rawY = (offset.y - canvasRect.top - pan.y) / scale;
            const { x, y } = snapToGrid(rawX, rawY);
            
            // Create a typography item from the font
            const newItem: Omit<CanvasItem, 'id' | 'position'> = {
              type: 'typography' as any,
              content: {
                font: item.font,
              },
            };
            
            if (onAddItem) {
              onAddItem(newItem, { x, y });
            }
          }
        }
        // Handle font pairing drop
        else if (item.pairing) {
          const offset = monitor.getClientOffset();
          if (offset) {
            const rawX = (offset.x - canvasRect.left - pan.x) / scale;
            const rawY = (offset.y - canvasRect.top - pan.y) / scale;
            const { x, y } = snapToGrid(rawX, rawY);
            
            // Create a card from the font pairing
            const newCard: Omit<CanvasItem, 'id' | 'position'> = {
              type: 'card',
              content: {
                title: 'Font Pairing',
                description: `${item.pairing.header.family} / ${item.pairing.body.family}`,
                tags: [item.pairing.header.family, item.pairing.body.family],
              },
            };
            
            if (onAddItem) {
              onAddItem(newCard, { x, y });
            }
          }
        }
        // If this is a new item being dropped from the drawer
        else if (item.isNew && item.goal) {
          const offset = monitor.getClientOffset();
          if (offset) {
            const rawX = (offset.x - canvasRect.left - pan.x) / scale;
            const rawY = (offset.y - canvasRect.top - pan.y) / scale;
            const { x, y } = snapToGrid(rawX, rawY);
            
            // Create a card from the goal
            const newCard: Omit<CanvasItem, 'id' | 'position'> = {
              type: 'card',
              content: {
                title: item.goal.label,
                description: '',
                tags: [],
              },
            };
            
            if (onAddItem) {
              onAddItem(newCard, { x, y });
            }
          }
        }
        // Handle archetype drop
        else if (item.isNew && item.archetype) {
          const offset = monitor.getClientOffset();
          if (offset) {
            const rawX = (offset.x - canvasRect.left - pan.x) / scale;
            const rawY = (offset.y - canvasRect.top - pan.y) / scale;
            const { x, y } = snapToGrid(rawX, rawY);
            
            // Create a card from the archetype
            const newCard: Omit<CanvasItem, 'id' | 'position'> = {
              type: 'card',
              content: {
                title: item.isPrimary ? 'Primary Archetype' : item.archetype.name,
                description: item.isPrimary 
                  ? `${item.archetype.name} - ${item.archetype.tagline}`
                  : item.archetype.tagline,
                tags: item.archetype.traits,
                variant: item.isPrimary ? 'primary-archetype' : 'supporting-archetype',
              },
            };
            
            if (onAddItem) {
              onAddItem(newCard, { x, y });
            }
          }
        }
        // Handle image drop (e.g., from Visual Lab)
        else if (item.isNew && item.type === 'image' && item.content) {
          const offset = monitor.getClientOffset();
          if (offset) {
            const rawX = (offset.x - canvasRect.left - pan.x) / scale;
            const rawY = (offset.y - canvasRect.top - pan.y) / scale;
            const { x, y } = snapToGrid(rawX, rawY);
            
            // Create an image item
            const newImage: Omit<CanvasItem, 'id' | 'position'> = {
              type: 'image',
              content: item.content,
            };
            
            if (onAddItem) {
              onAddItem(newImage, { x, y });
            }
          }
        }
        // Handle design element card drop (with visual styling)
        else if (item.isNew && item.visualExample) {
          const offset = monitor.getClientOffset();
          if (offset) {
            const rawX = (offset.x - canvasRect.left - pan.x) / scale;
            const rawY = (offset.y - canvasRect.top - pan.y) / scale;
            const { x, y } = snapToGrid(rawX, rawY);
            
            // Create a card with visual styling preserved
            const newCard: Omit<CanvasItem, 'id' | 'position'> = {
              type: 'card',
              content: {
                title: item.title,
                description: item.description,
                tags: item.tags,
                visualExample: item.visualExample,
                customColors: item.customColors,
                cardLabel: item.cardLabel,
              },
            };
            
            if (onAddItem) {
              onAddItem(newCard, { x, y });
            }
          }
        }
        // Handle design element card drop (with SVG pattern)
        else if (item.isNew && item.svgPattern) {
          const offset = monitor.getClientOffset();
          if (offset) {
            const rawX = (offset.x - canvasRect.left - pan.x) / scale;
            const rawY = (offset.y - canvasRect.top - pan.y) / scale;
            const { x, y } = snapToGrid(rawX, rawY);
            
            // Create a card with SVG pattern preserved
            const newCard: Omit<CanvasItem, 'id' | 'position'> = {
              type: 'card',
              content: {
                title: item.title,
                description: item.description,
                tags: item.tags,
                svgPattern: item.svgPattern,
                customColors: item.customColors,
                cardLabel: item.cardLabel,
              },
            };
            
            if (onAddItem) {
              onAddItem(newCard, { x, y });
            }
          }
        }
        // If this is an existing canvas item being repositioned
        else if (!item.isNew && item.id && delta) {
          const newX = item.originalX + delta.x / scale;
          const newY = item.originalY + delta.y / scale;
          const snapped = snapToGrid(newX, newY);
          onUpdatePosition(item.id, snapped);
        }
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }), [onAddItem, onUpdatePosition, scale, pan]);

  useEffect(() => {
    const currentRef = downloadMenuRef.current;
    const handleClickOutside = (event: MouseEvent) => {
      if (currentRef && !currentRef.contains(event.target as Node)) {
        setShowDownloadMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const currentRef = uploadMenuRef.current;
    const handleClickOutside = (event: MouseEvent) => {
      if (currentRef && !currentRef.contains(event.target as Node)) {
        setShowUploadMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const currentRef = clearMenuRef.current;
    const handleClickOutside = (event: MouseEvent) => {
      if (currentRef && !currentRef.contains(event.target as Node)) {
        setShowClearModal(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const currentRef = colorPickerRef.current;
    const handleClickOutside = (event: MouseEvent) => {
      if (currentRef && !currentRef.contains(event.target as Node)) {
        setShowColorPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={(node) => {
        canvasRef.current = node;
        drop(node);
      }}
      data-canvas="true"
      className="flex-1 relative overflow-hidden"
      style={{
        cursor: isPanning ? 'grabbing' : 'grab',
        backgroundColor: '#FAFAF9',
      }}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Infinite Grid Background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle, rgba(19, 23, 24, 0.35) 1px, transparent 1px)
          `,
          backgroundSize: `${12 * scale}px ${12 * scale}px`,
          backgroundPosition: `${pan.x % (12 * scale)}px ${pan.y % (12 * scale)}px`,
        }}
      />

      {/* Overlay when dragging over */}
      {isOver && (
        <div className="absolute inset-0 bg-primary/5 border-2 border-dashed border-primary/30 pointer-events-none z-10" />
      )}

      {/* Empty state */}
      {items.length === 0 && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10">
          <div className="text-center max-w-md px-4">
            <h3 className="text-lg sm:text-xl font-medium mb-2 text-foreground/80">
              Your Brand Canvas Awaits
            </h3>
            <p className="text-sm text-muted-foreground text-center">
              Start your journey below to collect cards and build your personal brand system
            </p>
          </div>
        </div>
      )}

      {/* Canvas Items Container - Transformed */}
      <div 
        data-canvas-items="true"
        className="absolute inset-0 pointer-events-none"
        style={{ 
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
          transformOrigin: '0 0',
        }}
      >
        <div className="relative pointer-events-auto" style={{ width: '10000px', height: '10000px' }}>
          {items.map((item) => (
            <DraggableCanvasItem
              key={item.id}
              item={item}
              onUpdatePosition={onUpdatePosition}
              onUpdateContent={onUpdateContent}
              onRemove={onRemoveItem}
            />
          ))}
        </div>
      </div>

      {/* Canvas Controls */}
      <div className="absolute top-4 left-6 z-20 flex flex-col gap-3" data-zoom-control="true">
        {/* Home Button */}
        <div className="relative">
          <div className="relative flex overflow-hidden rounded-full shadow-[0_6px_6px_rgba(0,0,0,0.2),0_0_20px_rgba(0,0,0,0.1)] transition-all duration-[400ms] ease-[cubic-bezier(0.175,0.885,0.32,2.2)] hover:shadow-[0_8px_8px_rgba(0,0,0,0.25),0_0_24px_rgba(0,0,0,0.15)]">
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
                boxShadow: 'inset 2px 2px 1px 0 rgba(255, 255, 255, 0.5), inset -1px -1px 1px 1px rgba(255, 255, 255, 0.5)',
              }}
            />
            
            {/* Content Layer */}
            <button
              className="relative z-[3] w-12 h-12 flex items-center justify-center text-foreground transition-all duration-200 hover:scale-95"
              onClick={resetView}
              title="Reset View"
            >
              <Home className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Clear Canvas Button */}
        <div className="relative" ref={clearMenuRef}>
          <div className="relative flex overflow-hidden rounded-full shadow-[0_6px_6px_rgba(0,0,0,0.2),0_0_20px_rgba(0,0,0,0.1)] transition-all duration-[400ms] ease-[cubic-bezier(0.175,0.885,0.32,2.2)] hover:shadow-[0_8px_8px_rgba(0,0,0,0.25),0_0_24px_rgba(0,0,0,0.15)]">
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
                boxShadow: 'inset 2px 2px 1px 0 rgba(255, 255, 255, 0.5), inset -1px -1px 1px 1px rgba(255, 255, 255, 0.5)',
              }}
            />
            
            {/* Content Layer */}
            <button
              className="relative z-[3] w-12 h-12 flex items-center justify-center text-foreground transition-all duration-200 hover:scale-95"
              onClick={() => setShowClearModal(!showClearModal)}
              title="Clear Canvas"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>

          {/* Clear Menu */}
          {showClearModal && (
            <div className="absolute top-0 left-14 z-30">
              {/* Liquid Glass Menu */}
              <div className="relative flex flex-col overflow-hidden rounded-2xl shadow-[0_6px_6px_rgba(0,0,0,0.2),0_0_20px_rgba(0,0,0,0.1)] min-w-[200px] will-change-transform">
                {/* Glass Effect Layer */}
                <div 
                  className="absolute inset-0 z-0 overflow-hidden pointer-events-none"
                  style={{
                    backdropFilter: 'blur(3px)',
                    isolation: 'isolate',
                  }}
                />
                
                {/* Tint Layer */}
                <div 
                  className="absolute inset-0 z-[1] pointer-events-none"
                  style={{
                    background: 'rgba(255, 255, 255, 0.25)',
                  }}
                />
                
                {/* Shine Layer */}
                <div 
                  className="absolute inset-0 z-[2] overflow-hidden pointer-events-none"
                  style={{
                    boxShadow: 'inset 2px 2px 1px 0 rgba(255, 255, 255, 0.5), inset -1px -1px 1px 1px rgba(255, 255, 255, 0.5)',
                  }}
                />
                
                {/* Content Layer */}
                <div className="relative z-[3] p-2 space-y-1">
                  {onClearCanvas && (
                    <button
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-foreground/90 hover:text-foreground hover:bg-white/30 hover:shadow-[inset_-2px_-2px_2px_rgba(0,0,0,0.1)] hover:backdrop-blur-[2px] rounded-xl transition-all duration-100 text-left"
                      onClick={() => {
                        onClearCanvas();
                        setShowClearModal(false);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Clear Canvas</span>
                    </button>
                  )}
                  {onClearAll && (
                    <button
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-foreground/90 hover:text-foreground hover:bg-white/30 hover:shadow-[inset_-2px_-2px_2px_rgba(0,0,0,0.1)] hover:backdrop-blur-[2px] rounded-xl transition-all duration-100 text-left"
                      onClick={() => {
                        onClearAll();
                        setShowClearModal(false);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Clear & Reset</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Zoom In Button */}
        <div className="relative">
          <div className="relative flex overflow-hidden rounded-full shadow-[0_6px_6px_rgba(0,0,0,0.2),0_0_20px_rgba(0,0,0,0.1)] transition-all duration-[400ms] ease-[cubic-bezier(0.175,0.885,0.32,2.2)] hover:shadow-[0_8px_8px_rgba(0,0,0,0.25),0_0_24px_rgba(0,0,0,0.15)]">
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
                boxShadow: 'inset 2px 2px 1px 0 rgba(255, 255, 255, 0.5), inset -1px -1px 1px 1px rgba(255, 255, 255, 0.5)',
              }}
            />
            
            {/* Content Layer */}
            <button
              className="relative z-[3] w-12 h-12 flex items-center justify-center text-foreground transition-all duration-200 hover:scale-95"
              onClick={zoomIn}
              title="Zoom In (Ctrl + Scroll)"
            >
              <ZoomIn className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Zoom Out Button */}
        <div className="relative">
          <div className="relative flex overflow-hidden rounded-full shadow-[0_6px_6px_rgba(0,0,0,0.2),0_0_20px_rgba(0,0,0,0.1)] transition-all duration-[400ms] ease-[cubic-bezier(0.175,0.885,0.32,2.2)] hover:shadow-[0_8px_8px_rgba(0,0,0,0.25),0_0_24px_rgba(0,0,0,0.15)]">
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
                boxShadow: 'inset 2px 2px 1px 0 rgba(255, 255, 255, 0.5), inset -1px -1px 1px 1px rgba(255, 255, 255, 0.5)',
              }}
            />
            
            {/* Content Layer */}
            <button
              className="relative z-[3] w-12 h-12 flex items-center justify-center text-foreground transition-all duration-200 hover:scale-95"
              onClick={zoomOut}
              title="Zoom Out (Ctrl + Scroll)"
            >
              <ZoomOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Download Progress Button */}
        {onDownloadProgress && (
          <div className="relative" ref={downloadMenuRef}>
            <div className="relative flex overflow-hidden rounded-full shadow-[0_6px_6px_rgba(0,0,0,0.2),0_0_20px_rgba(0,0,0,0.1)] transition-all duration-[400ms] ease-[cubic-bezier(0.175,0.885,0.32,2.2)] hover:shadow-[0_8px_8px_rgba(0,0,0,0.25),0_0_24px_rgba(0,0,0,0.15)]">
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
                  boxShadow: 'inset 2px 2px 1px 0 rgba(255, 255, 255, 0.5), inset -1px -1px 1px 1px rgba(255, 255, 255, 0.5)',
                }}
              />
              
              {/* Content Layer */}
              <button
                className="relative z-[3] w-12 h-12 flex items-center justify-center text-foreground transition-all duration-200 hover:scale-95"
                onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                title="Export Canvas"
              >
                <Download className="w-5 h-5" />
              </button>
            </div>

            {/* Download Menu */}
            {showDownloadMenu && (
              <div
                className="absolute top-0 left-14 z-30"
              >
                {/* Liquid Glass Menu */}
                <div className="relative flex flex-col overflow-hidden rounded-2xl shadow-[0_6px_6px_rgba(0,0,0,0.2),0_0_20px_rgba(0,0,0,0.1)] min-w-[140px] will-change-transform">
                  {/* Glass Effect Layer */}
                  <div 
                    className="absolute inset-0 z-0 overflow-hidden pointer-events-none"
                    style={{
                      backdropFilter: 'blur(3px)',
                      isolation: 'isolate',
                    }}
                  />
                  
                  {/* Tint Layer */}
                  <div 
                    className="absolute inset-0 z-[1] pointer-events-none"
                    style={{
                      background: 'rgba(255, 255, 255, 0.25)',
                    }}
                  />
                  
                  {/* Shine Layer */}
                  <div 
                    className="absolute inset-0 z-[2] overflow-hidden pointer-events-none"
                    style={{
                      boxShadow: 'inset 2px 2px 1px 0 rgba(255, 255, 255, 0.5), inset -1px -1px 1px 1px rgba(255, 255, 255, 0.5)',
                    }}
                  />
                  
                  {/* Content Layer */}
                  <div className="relative z-[3] p-2 space-y-1">
                    {onDownloadProgress && (
                      <button
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-foreground/90 hover:text-foreground hover:bg-white/30 hover:shadow-[inset_-2px_-2px_2px_rgba(0,0,0,0.1)] hover:backdrop-blur-[2px] rounded-xl transition-all duration-100 text-left"
                        onClick={() => {
                          onDownloadProgress();
                          setShowDownloadMenu(false);
                        }}
                      >
                        <FileJson className="w-4 h-4" />
                        <span>JSON</span>
                      </button>
                    )}
                    {onExportPNG && (
                      <button
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-foreground/90 hover:text-foreground hover:bg-white/30 hover:shadow-[inset_-2px_-2px_2px_rgba(0,0,0,0.1)] hover:backdrop-blur-[2px] rounded-xl transition-all duration-100 text-left"
                        onClick={() => {
                          onExportPNG();
                          setShowDownloadMenu(false);
                        }}
                      >
                        <FileImage className="w-4 h-4" />
                        <span>PNG</span>
                      </button>
                    )}
                    {onExportPDF && (
                      <button
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-foreground/90 hover:text-foreground hover:bg-white/30 hover:shadow-[inset_-2px_-2px_2px_rgba(0,0,0,0.1)] hover:backdrop-blur-[2px] rounded-xl transition-all duration-100 text-left"
                        onClick={() => {
                          onExportPDF();
                          setShowDownloadMenu(false);
                        }}
                      >
                        <FileText className="w-4 h-4" />
                        <span>PDF</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Upload Progress Button */}
        {onUploadProgress && (
          <div className="relative" ref={uploadMenuRef}>
            <div className="relative flex overflow-hidden rounded-full shadow-[0_6px_6px_rgba(0,0,0,0.2),0_0_20px_rgba(0,0,0,0.1)] transition-all duration-[400ms] ease-[cubic-bezier(0.175,0.885,0.32,2.2)] hover:shadow-[0_8px_8px_rgba(0,0,0,0.25),0_0_24px_rgba(0,0,0,0.15)]">
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
                  boxShadow: 'inset 2px 2px 1px 0 rgba(255, 255, 255, 0.5), inset -1px -1px 1px 1px rgba(255, 255, 255, 0.5)',
                }}
              />
              
              {/* Content Layer */}
              <button
                className="relative z-[3] w-12 h-12 flex items-center justify-center text-foreground transition-all duration-200 hover:scale-95"
                onClick={() => setShowUploadMenu(!showUploadMenu)}
                title="Upload Progress (Load JSON)"
              >
                <Upload className="w-5 h-5" />
              </button>
            </div>

            {/* Upload Menu */}
            {showUploadMenu && (
              <div
                className="absolute top-0 left-14 z-30"
              >
                {/* Liquid Glass Menu */}
                <div className="relative flex flex-col overflow-hidden rounded-2xl shadow-[0_6px_6px_rgba(0,0,0,0.2),0_0_20px_rgba(0,0,0,0.1)] min-w-[140px] will-change-transform">
                  {/* Glass Effect Layer */}
                  <div 
                    className="absolute inset-0 z-0 overflow-hidden pointer-events-none"
                    style={{
                      backdropFilter: 'blur(3px)',
                      isolation: 'isolate',
                    }}
                  />
                  
                  {/* Tint Layer */}
                  <div 
                    className="absolute inset-0 z-[1] pointer-events-none"
                    style={{
                      background: 'rgba(255, 255, 255, 0.25)',
                    }}
                  />
                  
                  {/* Shine Layer */}
                  <div 
                    className="absolute inset-0 z-[2] overflow-hidden pointer-events-none"
                    style={{
                      boxShadow: 'inset 2px 2px 1px 0 rgba(255, 255, 255, 0.5), inset -1px -1px 1px 1px rgba(255, 255, 255, 0.5)',
                    }}
                  />
                  
                  {/* Content Layer */}
                  <div className="relative z-[3] p-2 space-y-1">
                    {onUploadProgress && (
                      <button
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-foreground/90 hover:text-foreground hover:bg-white/30 hover:shadow-[inset_-2px_-2px_2px_rgba(0,0,0,0.1)] hover:backdrop-blur-[2px] rounded-xl transition-all duration-100 text-left"
                        onClick={() => {
                          onUploadProgress();
                          setShowUploadMenu(false);
                        }}
                      >
                        <FileJson className="w-4 h-4" />
                        <span>JSON</span>
                      </button>
                    )}
                    <button
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-foreground/90 hover:text-foreground hover:bg-white/30 hover:shadow-[inset_-2px_-2px_2px_rgba(0,0,0,0.1)] hover:backdrop-blur-[2px] rounded-xl transition-all duration-100 text-left"
                      onClick={handleUploadImage}
                    >
                      <FileImage className="w-4 h-4" />
                      <span>Image</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Toolbar - Content Creation */}
      <div className="absolute top-4 right-6 z-20 flex flex-col gap-3" data-zoom-control="true">
        {/* Add Title Button */}
        <div className="relative">
          <div className="relative flex overflow-hidden rounded-full shadow-[0_6px_6px_rgba(0,0,0,0.2),0_0_20px_rgba(0,0,0,0.1)] transition-all duration-[400ms] ease-[cubic-bezier(0.175,0.885,0.32,2.2)] hover:shadow-[0_8px_8px_rgba(0,0,0,0.25),0_0_24px_rgba(0,0,0,0.15)]">
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
                boxShadow: 'inset 2px 2px 1px 0 rgba(255, 255, 255, 0.5), inset -1px -1px 1px 1px rgba(255, 255, 255, 0.5)',
              }}
            />
            
            {/* Content Layer */}
            <button
              className="relative z-[3] w-12 h-12 flex items-center justify-center text-foreground transition-all duration-200 hover:scale-95"
              onClick={handleAddTitle}
              title="Add Title"
            >
              <Type className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Add Note Button */}
        <div className="relative">
          <div className="relative flex overflow-hidden rounded-full shadow-[0_6px_6px_rgba(0,0,0,0.2),0_0_20px_rgba(0,0,0,0.1)] transition-all duration-[400ms] ease-[cubic-bezier(0.175,0.885,0.32,2.2)] hover:shadow-[0_8px_8px_rgba(0,0,0,0.25),0_0_24px_rgba(0,0,0,0.15)]">
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
                boxShadow: 'inset 2px 2px 1px 0 rgba(255, 255, 255, 0.5), inset -1px -1px 1px 1px rgba(255, 255, 255, 0.5)',
              }}
            />
            
            {/* Content Layer */}
            <button
              className="relative z-[3] w-12 h-12 flex items-center justify-center text-foreground transition-all duration-200 hover:scale-95"
              onClick={handleAddNote}
              title="Add Note"
            >
              <StickyNote className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Add Color Card Button */}
        <div className="relative">
          <div className="relative flex overflow-hidden rounded-full shadow-[0_6px_6px_rgba(0,0,0,0.2),0_0_20px_rgba(0,0,0,0.1)] transition-all duration-[400ms] ease-[cubic-bezier(0.175,0.885,0.32,2.2)] hover:shadow-[0_8px_8px_rgba(0,0,0,0.25),0_0_24px_rgba(0,0,0,0.15)]">
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
                boxShadow: 'inset 2px 2px 1px 0 rgba(255, 255, 255, 0.5), inset -1px -1px 1px 1px rgba(255, 255, 255, 0.5)',
              }}
            />
            
            {/* Content Layer */}
            <button
              className="relative z-[3] w-12 h-12 flex items-center justify-center text-foreground transition-all duration-200 hover:scale-95"
              onClick={handleAddColorCard}
              title="Add Color Card"
            >
              <Square className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Pick Color Button */}
        <div className="relative">
          <div className="relative flex overflow-hidden rounded-full shadow-[0_6px_6px_rgba(0,0,0,0.2),0_0_20px_rgba(0,0,0,0.1)] transition-all duration-[400ms] ease-[cubic-bezier(0.175,0.885,0.32,2.2)] hover:shadow-[0_8px_8px_rgba(0,0,0,0.25),0_0_24px_rgba(0,0,0,0.15)]">
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
                boxShadow: 'inset 2px 2px 1px 0 rgba(255, 255, 255, 0.5), inset -1px -1px 1px 1px rgba(255, 255, 255, 0.5)',
              }}
            />
            
            {/* Content Layer */}
            <button
              className="relative z-[3] w-12 h-12 flex items-center justify-center text-foreground transition-all duration-200 hover:scale-95"
              onClick={() => setShowColorPicker(!showColorPicker)}
              title="Pick Color"
            >
              <Pipette className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Zoom Indicator */}
      <div className="absolute bottom-4 right-4 z-20" data-zoom-control="true">
        <div className="relative flex overflow-hidden rounded-full shadow-[0_6px_6px_rgba(0,0,0,0.2),0_0_20px_rgba(0,0,0,0.1)]">
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
              boxShadow: 'inset 2px 2px 1px 0 rgba(255, 255, 255, 0.5), inset -1px -1px 1px 1px rgba(255, 255, 255, 0.5)',
            }}
          />
          
          {/* Content Layer */}
          <div className="relative z-[3] px-4 py-2">
            <span className="text-xs font-medium text-foreground">
              {Math.round(scale * 100)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}