import { useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useDrag } from 'react-dnd';
import { X, Pipette, Pencil, ExternalLink } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { motion, AnimatePresence } from 'motion/react';
import type { CanvasItem } from '@/app/pages/Studio';

interface DraggableCanvasItemProps {
  item: CanvasItem;
  onUpdatePosition: (id: string, position: { x: number; y: number }) => void;
  onUpdateContent?: (id: string, content: any) => void;
  onRemove: (id: string) => void;
}

export function DraggableCanvasItem({
  item,
  onUpdatePosition,
  onUpdateContent,
  onRemove,
}: DraggableCanvasItemProps) {
  const itemRef = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: item.type.toUpperCase(),
    item: () => {
      // Return current position when drag starts
      return {
        id: item.id,
        isNew: false,
        originalX: item.position.x,
        originalY: item.position.y,
      };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [item.id, item.position.x, item.position.y]);

  drag(itemRef);

  const [isEditingLabel, setIsEditingLabel] = useState(false);
  const [editLabel, setEditLabel] = useState(item.content.label || '');
  const [editColor, setEditColor] = useState(item.content.color || '#000000');
  const [colorFormat, setColorFormat] = useState<'hex' | 'rgb'>('hex');
  const [isEditingText, setIsEditingText] = useState(false);
  const [editText, setEditText] = useState(item.content.text || '');
  const [isEditingCardTitle, setIsEditingCardTitle] = useState(false);
  const [editCardTitle, setEditCardTitle] = useState(item.content.title || '');
  const [isEditingCardDescription, setIsEditingCardDescription] = useState(false);
  const [editCardDescription, setEditCardDescription] = useState(item.content.description || '');

  const handleLabelEdit = () => {
    setIsEditingLabel(true);
    setEditLabel(item.content.label || '');
    setEditColor(item.content.color || '#000000');
  };

  const handleLabelSave = () => {
    if (onUpdateContent) {
      onUpdateContent(item.id, { 
        ...item.content, 
        label: editLabel.trim(),
        color: editColor
      });
    }
    setIsEditingLabel(false);
  };

  const handleLabelCancel = () => {
    setEditLabel(item.content.label || '');
    setIsEditingLabel(false);
  };

  const handleTextClick = () => {
    if (onUpdateContent) {
      setIsEditingText(true);
      setEditText(item.content.text || '');
    }
  };

  const handleTextBlur = () => {
    if (onUpdateContent && editText.trim()) {
      onUpdateContent(item.id, { ...item.content, text: editText.trim() });
    }
    setIsEditingText(false);
  };

  const handleTextKeyDown = (e: React.KeyboardEvent) => {
    // Allow Cmd+A / Ctrl+A for select all - don't interfere with it
    if ((e.metaKey || e.ctrlKey) && (e.key.toLowerCase() === 'a')) {
      // Let the browser handle it
      return;
    }
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleTextBlur();
    } else if (e.key === 'Escape') {
      setEditText(item.content.text || '');
      setIsEditingText(false);
    }
  };

  const handleCardTitleClick = () => {
    if (onUpdateContent) {
      setIsEditingCardTitle(true);
      setEditCardTitle(item.content.title || '');
    }
  };

  const handleCardTitleBlur = () => {
    if (onUpdateContent && editCardTitle.trim()) {
      onUpdateContent(item.id, { ...item.content, title: editCardTitle.trim() });
    }
    setIsEditingCardTitle(false);
  };

  const handleCardDescriptionClick = () => {
    if (onUpdateContent) {
      setIsEditingCardDescription(true);
      setEditCardDescription(item.content.description || '');
    }
  };

  const handleCardDescriptionBlur = () => {
    if (onUpdateContent && editCardDescription.trim()) {
      onUpdateContent(item.id, { ...item.content, description: editCardDescription.trim() });
    }
    setIsEditingCardDescription(false);
  };

  const pickColorFromScreen = async () => {
    // Check if EyeDropper API is available
    if ('EyeDropper' in window) {
      try {
        const eyeDropper = new (window as any).EyeDropper();
        const result = await eyeDropper.open();
        // Immediately update the color
        if (onUpdateContent) {
          onUpdateContent(item.id, { ...item.content, color: result.sRGBHex });
        }
      } catch (error) {
        // User cancelled or error occurred
      }
    } else {
      alert('Color picker is not supported in your browser. Please use Chrome, Edge, or another Chromium-based browser.');
    }
  };

  // Calculate if color is dark (returns true if dark, false if light)
  const isColorDark = (hexColor: string): boolean => {
    // Remove # if present
    const hex = hexColor.replace('#', '');
    
    // Convert to RGB
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    // Calculate relative luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    // Return true if dark (luminance < 0.5)
    return luminance < 0.5;
  };

  // Convert HEX to RGB
  const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
    const cleanHex = hex.replace('#', '');
    const r = parseInt(cleanHex.substr(0, 2), 16);
    const g = parseInt(cleanHex.substr(2, 2), 16);
    const b = parseInt(cleanHex.substr(4, 2), 16);
    return { r, g, b };
  };

  // Convert RGB to HEX
  const rgbToHex = (r: number, g: number, b: number): string => {
    const toHex = (n: number) => {
      const hex = Math.max(0, Math.min(255, Math.round(n))).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  // Get RGB values from editColor
  const getRgbValues = () => {
    return hexToRgb(editColor);
  };

  // Update color from RGB input
  const updateColorFromRgb = (r: number, g: number, b: number) => {
    setEditColor(rgbToHex(r, g, b));
  };

  return (
    <div
      ref={itemRef}
      data-canvas-item="true"
      data-canvas-item-id={item.id}
      className="absolute cursor-move group"
      style={{
        left: item.position.x,
        top: item.position.y,
        opacity: isDragging ? 0.3 : 1,
      }}
    >
      {/* Grid snap indicator - shows during drag */}
      {isDragging && (
        <div 
          className="absolute inset-0 border-2 border-dashed border-primary/50 rounded-lg pointer-events-none -z-10"
          style={{
            boxShadow: '0 0 0 1px rgba(254, 230, 234, 0.3)',
          }}
        />
      )}
      
      <div className={`
        relative rounded-lg shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] p-3 transition-all
        ${item.type === 'typography' ? 'w-[350px]' : 'w-[240px]'}
        ${item.type === 'card' && item.content.variant === 'supporting-archetype'
          ? 'bg-muted outline outline-1 outline-muted-foreground/30 outline-dashed'
          : 'bg-white outline outline-1 outline-[#131718]'
        }
      `}>
        {/* Remove button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemove(item.id)}
          className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full bg-destructive/90 hover:bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity z-50"
        >
          <X className="h-3 w-3" />
        </Button>

        {/* Render content based on type */}
        {item.type === 'card' && item.content.variant === 'supporting-archetype' ? (
          // Supporting Archetype Card - matches drawer styling
          <div>
            <div className="mb-2 pb-2 border-b border-muted-foreground/20">
              <span className="text-xs font-medium text-muted-foreground/60 uppercase tracking-wide">
                Supporting Archetype
              </span>
            </div>
            {item.content.title && (
              <div className="text-sm font-medium text-muted-foreground mb-0.5">
                {item.content.title}
              </div>
            )}
            {item.content.description && (
              <div className="text-xs text-muted-foreground/70 italic mb-2">
                {item.content.description}
              </div>
            )}
            {item.content.tags && item.content.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {item.content.tags.map((tag: string, idx: number) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 text-xs rounded bg-muted/50 text-muted-foreground/80 border border-muted-foreground/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <p className="text-xs text-muted-foreground/60 mt-3 pt-2 border-t border-muted-foreground/10 italic">
              Use as accent, not focus
            </p>
          </div>
        ) : item.type === 'card' && item.content.variant === 'primary-archetype' ? (
          // Primary Archetype Card
          <div>
            <div className="mb-2 pb-2 border-b border-primary/20">
              <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                Primary Archetype
              </span>
            </div>
            {item.content.title && (
              <h3 className="font-medium mb-1 text-sm">{item.content.title}</h3>
            )}
            {item.content.description && (
              <p className="text-xs text-muted-foreground mb-1.5 italic">{item.content.description}</p>
            )}
            {item.content.tags && item.content.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {item.content.tags.map((tag: string, idx: number) => (
                  <span
                    key={idx}
                    className="px-2 py-1 text-xs rounded-md bg-primary/10 text-primary border border-primary/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <p className="text-xs text-muted-foreground/60 mt-3 pt-2 border-t border-border/30 italic">
              Core of your brand identity
            </p>
          </div>
        ) : item.type === 'card' ? (
          // Regular Card
          <div>
            {/* Visual background for Design Element cards */}
            {(item.content.visualExample || item.content.svgPattern) && (
              <div className="mb-3 -mx-3 -mt-3 h-24 rounded-t-lg overflow-hidden relative">
                {item.content.visualExample ? (
                  <div 
                    className="w-full h-full"
                    style={{ 
                      background: item.content.visualExample 
                    }}
                  />
                ) : item.content.svgPattern ? (
                  <div className="w-full h-full">
                    {item.content.svgPattern}
                  </div>
                ) : null}
              </div>
            )}
            {item.content.title && (
              <div 
                onClick={(e) => {
                  e.stopPropagation();
                  handleCardTitleClick();
                }}
                className="cursor-text"
              >
                {isEditingCardTitle ? (
                  <input
                    type="text"
                    value={editCardTitle}
                    onChange={(e) => setEditCardTitle(e.target.value)}
                    onBlur={handleCardTitleBlur}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleCardTitleBlur();
                      } else if (e.key === 'Escape') {
                        setEditCardTitle(item.content.title || '');
                        setIsEditingCardTitle(false);
                      }
                    }}
                    className="w-full bg-transparent border-2 border-primary rounded px-1 py-0.5 font-medium text-sm focus:outline-none"
                    autoFocus
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <h3 className="font-medium mb-1 text-sm">{item.content.title}</h3>
                )}
              </div>
            )}
            {item.content.description && (
              <div 
                onClick={(e) => {
                  e.stopPropagation();
                  handleCardDescriptionClick();
                }}
                className="cursor-text"
              >
                {isEditingCardDescription ? (
                  <textarea
                    value={editCardDescription}
                    onChange={(e) => setEditCardDescription(e.target.value)}
                    onBlur={handleCardDescriptionBlur}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleCardDescriptionBlur();
                      } else if (e.key === 'Escape') {
                        setEditCardDescription(item.content.description || '');
                        setIsEditingCardDescription(false);
                      }
                    }}
                    className="w-full bg-transparent border-2 border-primary rounded px-1 py-0.5 text-xs text-muted-foreground focus:outline-none resize-none"
                    autoFocus
                    rows={2}
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <p className="text-xs text-muted-foreground mb-1.5">{item.content.description}</p>
                )}
              </div>
            )}
            {item.content.tags && item.content.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {item.content.tags.map((tag: string, idx: number) => (
                  <span
                    key={idx}
                    className="px-2 py-1 text-xs rounded-md bg-primary/10 text-primary border border-primary/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        ) : null}

        {item.type === 'image' && (
          <div>
            {item.content.url && (
              <>
                <img
                  src={item.content.url}
                  alt={item.content.alt || item.content.caption || 'Canvas item'}
                  className="w-full h-auto rounded"
                  crossOrigin="anonymous"
                  onError={(e) => {
                    // If CORS fails, retry without crossOrigin
                    const img = e.currentTarget;
                    if (img.crossOrigin) {
                      img.crossOrigin = '';
                      img.src = img.src; // Trigger reload
                    }
                  }}
                />
                {item.content.caption && (
                  <p className="text-center text-sm font-medium lowercase mt-2">{item.content.caption}</p>
                )}
              </>
            )}
          </div>
        )}

        {item.type === 'link' && (
          <a
            href={item.content.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block group/link"
            draggable="false"
          >
            {/* Link preview card - clean design matching other cards */}
            {item.content.image ? (
              // Visual link preview with image
              <div>
                <div className="mb-3 -mx-3 -mt-3 rounded-t-lg overflow-hidden relative bg-muted">
                  <img 
                    src={item.content.image}
                    alt={item.content.title || 'Link preview'}
                    className="w-full h-auto object-cover"
                    style={{ maxHeight: '400px' }}
                    loading="lazy"
                    crossOrigin="anonymous"
                    onError={(e) => {
                      // If CORS fails, retry without crossOrigin
                      const img = e.currentTarget;
                      if (img.crossOrigin) {
                        img.crossOrigin = '';
                        img.src = img.src; // Trigger reload
                      } else {
                        // If still fails, hide the image container
                        const container = img.parentElement;
                        if (container) {
                          container.style.display = 'none';
                        }
                      }
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
                </div>
                <div className="flex items-start gap-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-[#131718] group-hover/link:bg-[#FEE6EA] transition-colors"
                  >
                    <ExternalLink className="w-5 h-5 text-white group-hover/link:text-[#131718] transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    {item.content.domain && (
                      <span className="text-xs text-muted-foreground block mb-0.5 truncate">
                        {item.content.domain}
                      </span>
                    )}
                    <h4 className="text-sm font-semibold line-clamp-2 mb-1">
                      {item.content.title || 'Reference Link'}
                    </h4>
                    {item.content.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {item.content.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              // Text-only link preview (fallback)
              <div className="flex items-start gap-3">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-[#131718] group-hover/link:bg-[#FEE6EA] transition-colors"
                >
                  <ExternalLink className="w-5 h-5 text-white group-hover/link:text-[#131718] transition-colors" />
                </div>
                <div className="flex-1 min-w-0">
                  {item.content.domain && (
                    <span className="text-xs text-muted-foreground block mb-0.5 truncate">
                      {item.content.domain}
                    </span>
                  )}
                  <h4 className="text-sm font-semibold line-clamp-2 mb-1">
                    {item.content.title || 'Reference Link'}
                  </h4>
                  {item.content.displayUrl && (
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {item.content.displayUrl}
                    </p>
                  )}
                </div>
              </div>
            )}
          </a>
        )}

        {item.type === 'text' && (
          <div 
            onClick={handleTextClick}
            className="cursor-text"
          >
            {isEditingText ? (
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onBlur={handleTextBlur}
                onKeyDown={handleTextKeyDown}
                className={`w-full bg-transparent border-2 border-primary rounded-lg px-2 py-1 focus:outline-none resize-none ${
                  item.content.isTitle 
                    ? 'font-semibold leading-relaxed' 
                    : 'text-sm font-normal leading-relaxed'
                }`}
                style={{
                  fontSize: item.content.isTitle ? '20px' : '14px',
                }}
                autoFocus
                rows={3}
              />
            ) : (
              <div 
                className={`whitespace-pre-wrap leading-relaxed ${
                  item.content.isTitle 
                    ? 'font-semibold' 
                    : 'text-sm font-normal'
                }`}
                style={{
                  fontSize: item.content.isTitle ? '20px' : '14px',
                }}
              >
                {item.content.text}
              </div>
            )}
          </div>
        )}

        {item.type === 'color' && (
          <div className="flex flex-col items-center gap-2">
            <div className="relative w-full">
              <div 
                className="w-full h-24 rounded-lg shadow-md"
                style={{ backgroundColor: item.content.color }}
              />
              {onUpdateContent && (
                <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  {/* Eyedropper - pick color from screen */}
                  <button
                    onClick={pickColorFromScreen}
                    className="p-1.5 rounded-md transition-colors hover:bg-black/10"
                    title="Pick color from screen"
                  >
                    <Pipette 
                      className="h-4 w-4" 
                      style={{ 
                        color: isColorDark(item.content.color) ? '#FEE6EA' : '#131718' 
                      }} 
                    />
                  </button>
                  {/* Rename label */}
                  <button
                    onClick={handleLabelEdit}
                    className="p-1.5 rounded-md transition-colors hover:bg-black/10"
                    title="Rename color"
                  >
                    <Pencil 
                      className="h-4 w-4" 
                      style={{ 
                        color: isColorDark(item.content.color) ? '#FEE6EA' : '#131718' 
                      }} 
                    />
                  </button>
                </div>
              )}
            </div>
            {item.content.label && (
              <p className="text-sm font-medium text-center">
                {item.content.label} - {item.content.color.toUpperCase()}
              </p>
            )}
          </div>
        )}

        {item.type === 'typography' && item.content.font && (
          <TypographyCard font={item.content.font} />
        )}
      </div>

      {/* Edit Color Modal - Renaming and color editing */}
      {isEditingLabel && item.type === 'color' && createPortal(
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
            onClick={handleLabelCancel}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="backdrop-blur-3xl bg-[#FEE6EA]/95 border-2 border-white/30 rounded-2xl shadow-[0_16px_64px_0_rgba(0,0,0,0.15)] p-6 max-w-sm w-full"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Edit Color</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLabelCancel}
                  className="h-8 w-8 p-0 rounded-full hover:bg-white/20"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Color Preview with Picker */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Color Preview (Click to Change)</label>
                <label className="cursor-pointer relative block">
                  <div 
                    className="w-full h-20 rounded-lg shadow-md mb-3"
                    style={{ backgroundColor: editColor }}
                  />
                  <input
                    type="color"
                    value={editColor}
                    onChange={(e) => setEditColor(e.target.value)}
                    className="absolute bottom-5 left-1/2 -translate-x-1/2 opacity-0 w-0 h-0"
                  />
                </label>
              </div>

              {/* Label Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Color Label</label>
                <input
                  value={editLabel}
                  onChange={(e) => setEditLabel(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleLabelSave();
                    } else if (e.key === 'Escape') {
                      handleLabelCancel();
                    }
                  }}
                  placeholder="Color Label (e.g., Primary, Accent 1)"
                  className="w-full p-3 rounded-lg border-2 border-border bg-background/50 backdrop-blur-sm focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  onClick={handleLabelCancel}
                  className="hover:bg-white/20"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleLabelSave}
                >
                  Save
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}

// Typography Card Component for Canvas
function TypographyCard({ font }: { font: any }) {
  // Load Google Font dynamically
  useEffect(() => {
    const fontId = `font-${font.family.replace(/\s+/g, '-')}`;
    if (!document.getElementById(fontId)) {
      const link = document.createElement('link');
      link.id = fontId;
      link.rel = 'stylesheet';
      link.href = `https://fonts.googleapis.com/css2?family=${font.family.replace(/\s+/g, '+')}:wght@${font.googleFontsWeights}&display=swap`;
      document.head.appendChild(link);
    }
  }, [font]);

  const recommendedWeight = font.category === 'header' 
    ? (font.weights.includes('700') ? '700' : font.weights.includes('600') ? '600' : font.weights[Math.floor(font.weights.length / 2)])
    : '400';

  const googleFontsUrl = `https://fonts.google.com/specimen/${font.family.replace(/\s+/g, '+')}`;

  return (
    <div className="w-full">
      {/* Category badge */}
      <div className="mb-3">
        <span className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary border border-primary/20 capitalize">
          {font.category}
        </span>
      </div>

      {/* Font preview */}
      <div className="mb-4">
        <div
          className={`${font.category === 'header' ? 'text-3xl' : 'text-lg'} mb-2`}
          style={{
            fontFamily: font.family,
            fontWeight: recommendedWeight,
          }}
        >
          {font.category === 'header' ? 'Your Brand' : 'The quick brown fox jumps over'}
        </div>
      </div>

      {/* Font info */}
      <div className="space-y-3 pb-3 border-b border-border/30">
        <div>
          <div className="text-sm font-medium mb-1">{font.family}</div>
          <div className="text-xs text-muted-foreground italic">
            {font.description}
          </div>
        </div>

        {/* Available weights */}
        <div>
          <div className="text-xs text-muted-foreground mb-1">Available Weights:</div>
          <div className="flex flex-wrap gap-1">
            {font.weights.map((weight: string) => (
              <span
                key={weight}
                className="px-1.5 py-0.5 text-xs rounded bg-muted text-foreground/70"
              >
                {weight}
              </span>
            ))}
          </div>
        </div>

        {/* Style */}
        <div className="text-xs text-muted-foreground">
          Style: <span className="text-foreground">{font.style}</span>
        </div>
      </div>

      {/* Tags */}
      <div className="mt-3 mb-3">
        <div className="flex flex-wrap gap-1">
          {font.tags.slice(0, 4).map((tag: string, idx: number) => (
            <span
              key={idx}
              className="px-2 py-0.5 text-xs rounded-full bg-primary/5 text-primary/70 lowercase"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Download link */}
      <a
        href={googleFontsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        <ExternalLink className="w-3 h-3" />
        Download from Google Fonts
      </a>
    </div>
  );
}