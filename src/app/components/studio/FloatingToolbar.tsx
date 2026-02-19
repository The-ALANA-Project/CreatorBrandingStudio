import { useState, useRef, useEffect } from 'react';
import { 
  Type, 
  StickyNote, 
  Palette, 
  Pipette,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { CanvasItem } from '@/app/pages/Studio';
import { Button } from '../ui/button';

interface FloatingToolbarProps {
  onAddItem: (item: Omit<CanvasItem, 'id' | 'position'>) => void;
  canvasItems: CanvasItem[];
}

export function FloatingToolbar({ onAddItem }: FloatingToolbarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showTextInput, setShowTextInput] = useState(false);
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showScreenPicker, setShowScreenPicker] = useState(false);
  const [textContent, setTextContent] = useState('');
  const [noteTitle, setNoteTitle] = useState('');
  const [noteDescription, setNoteDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState('#FEE6EA');
  const [colorLabel, setColorLabel] = useState('');
  const [position, setPosition] = useState({ x: 16, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; startPosX: number; startPosY: number } | null>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);

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
      x: Math.max(0, Math.min(window.innerWidth - 60, dragRef.current.startPosX + deltaX)),
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

  useEffect(() => {
    if (!isExpanded) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (toolbarRef.current && !toolbarRef.current.contains(e.target as Node)) {
        setIsExpanded(false);
      }
    };

    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded]);

  const addThought = () => {
    if (textContent.trim()) {
      onAddItem({
        type: 'text',
        content: {
          text: textContent,
        },
      });
      setTextContent('');
      setShowTextInput(false);
      setIsExpanded(false);
    }
  };

  const addNote = () => {
    if (noteDescription.trim()) {
      onAddItem({
        type: 'card',
        content: {
          title: noteTitle.trim() || '',
          description: noteDescription,
          tags: [],
        },
      });
      setNoteTitle('');
      setNoteDescription('');
      setShowNoteInput(false);
      setIsExpanded(false);
    }
  };

  const addColor = () => {
    if (colorLabel.trim()) {
      onAddItem({
        type: 'color',
        content: {
          label: colorLabel,
          color: selectedColor,
        },
      });
      setColorLabel('');
      setShowColorPicker(false);
      setShowScreenPicker(false);
      setIsExpanded(false);
    }
  };

  const pickColorFromScreen = async () => {
    // Check if EyeDropper API is available
    if ('EyeDropper' in window) {
      try {
        const eyeDropper = new (window as any).EyeDropper();
        const result = await eyeDropper.open();
        setSelectedColor(result.sRGBHex);
      } catch (error) {
        // User cancelled or error occurred
        console.log('Color picking cancelled');
      }
    } else {
      alert('Color picker is not supported in your browser. Please use Chrome, Edge, or another Chromium-based browser.');
    }
  };

  return (
    <>
      <div 
        data-floating-toolbar="true"
        className="fixed z-30 select-none"
        style={{ 
          left: `${position.x}px`, 
          top: `${position.y}px`,
          cursor: isDragging ? 'grabbing' : 'grab',
        }}
        onMouseDown={handleMouseDown}
        ref={toolbarRef}
      >
        <div className="relative p-3">
          {/* Main circular toolbar with Liquid Glass */}
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
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              className="relative z-[3] w-12 h-12 flex items-center justify-center text-foreground transition-all duration-200 hover:scale-95"
            >
              {isExpanded ? (
                <X className="w-5 h-5" />
              ) : (
                <span className="text-2xl font-light">+</span>
              )}
            </button>
          </div>

          {/* Popup menu */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                className="absolute left-16 top-3"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Liquid Glass Menu */}
                <div className="relative flex flex-col overflow-hidden rounded-2xl shadow-[0_6px_6px_rgba(0,0,0,0.2),0_0_20px_rgba(0,0,0,0.1)] min-w-[180px] will-change-transform">
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
                    <button
                      onClick={() => {
                        setShowTextInput(true);
                        setIsExpanded(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-foreground/90 hover:text-foreground hover:bg-white/30 hover:shadow-[inset_-2px_-2px_2px_rgba(0,0,0,0.1)] hover:backdrop-blur-[2px] rounded-xl transition-all duration-100 text-left"
                    >
                      <Type className="w-4 h-4" />
                      Add Title
                    </button>
                    <button
                      onClick={() => {
                        setShowNoteInput(true);
                        setIsExpanded(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-foreground/90 hover:text-foreground hover:bg-white/30 hover:shadow-[inset_-2px_-2px_2px_rgba(0,0,0,0.1)] hover:backdrop-blur-[2px] rounded-xl transition-all duration-100 text-left"
                    >
                      <StickyNote className="w-4 h-4" />
                      Add Note
                    </button>
                    <button
                      onClick={() => {
                        setShowColorPicker(true);
                        setIsExpanded(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-foreground/90 hover:text-foreground hover:bg-white/30 hover:shadow-[inset_-2px_-2px_2px_rgba(0,0,0,0.1)] hover:backdrop-blur-[2px] rounded-xl transition-all duration-100 text-left"
                    >
                      <Palette className="w-4 h-4" />
                      Add Color
                    </button>
                    <button
                      onClick={async () => {
                        setIsExpanded(false);
                        // Wait a moment for the menu to close, then pick color
                        setTimeout(async () => {
                          if ('EyeDropper' in window) {
                            try {
                              const eyeDropper = new (window as any).EyeDropper();
                              const result = await eyeDropper.open();
                              // Open the screen picker modal with the picked color
                              setSelectedColor(result.sRGBHex);
                              setShowScreenPicker(true);
                            } catch (error) {
                              console.log('Color picking cancelled');
                            }
                          } else {
                            alert('Color picker is not supported in your browser. Please use Chrome, Edge, or another Chromium-based browser.');
                          }
                        }, 300);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-foreground/90 hover:text-foreground hover:bg-white/30 hover:shadow-[inset_-2px_-2px_2px_rgba(0,0,0,0.1)] hover:backdrop-blur-[2px] rounded-xl transition-all duration-100 text-left"
                    >
                      <Pipette className="w-4 h-4" />
                      Pick Color
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Text input modal */}
      <AnimatePresence>
        {showTextInput && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 flex items-center justify-center p-4"
            onClick={() => setShowTextInput(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="backdrop-blur-3xl bg-[#FEE6EA]/95 border-2 border-white/30 rounded-2xl shadow-[0_16px_64px_0_rgba(0,0,0,0.15)] p-6 max-w-md w-full"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Add Title</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowTextInput(false)}
                  className="h-8 w-8 p-0 rounded-full hover:bg-white/20"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <textarea
                value={textContent}
                onChange={(e) => setTextContent(e.target.value.toUpperCase())}
                placeholder="ENTER YOUR TITLE..."
                className="w-full min-h-[120px] p-3 rounded-lg border-2 border-border bg-background/50 backdrop-blur-sm resize-none focus:outline-none focus:border-primary transition-colors uppercase"
                autoFocus
              />
              
              <div className="flex justify-end gap-2 mt-4">
                <Button
                  variant="ghost"
                  onClick={() => setShowTextInput(false)}
                  className="hover:bg-white/20"
                >
                  Cancel
                </Button>
                <Button
                  onClick={addThought}
                  disabled={!textContent.trim()}
                >
                  Add to Canvas
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Note input modal */}
      <AnimatePresence>
        {showNoteInput && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 flex items-center justify-center p-4"
            onClick={() => setShowNoteInput(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="backdrop-blur-3xl bg-[#FEE6EA]/95 border-2 border-white/30 rounded-2xl shadow-[0_16px_64px_0_rgba(0,0,0,0.15)] p-6 max-w-md w-full"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Add Note</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNoteInput(false)}
                  className="h-8 w-8 p-0 rounded-full hover:bg-white/20"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <input
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                placeholder="Note Title"
                className="w-full p-3 rounded-lg border-2 border-border bg-background/50 backdrop-blur-sm focus:outline-none focus:border-primary transition-colors mb-3"
                autoFocus
              />
              
              <textarea
                value={noteDescription}
                onChange={(e) => setNoteDescription(e.target.value)}
                placeholder="Note Description"
                className="w-full min-h-[120px] p-3 rounded-lg border-2 border-border bg-background/50 backdrop-blur-sm resize-none focus:outline-none focus:border-primary transition-colors"
              />
              
              <div className="flex justify-end gap-2 mt-4">
                <Button
                  variant="ghost"
                  onClick={() => setShowNoteInput(false)}
                  className="hover:bg-white/20"
                >
                  Cancel
                </Button>
                <Button
                  onClick={addNote}
                  disabled={!noteDescription.trim()}
                >
                  Add to Canvas
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Color picker modal */}
      <AnimatePresence>
        {showColorPicker && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 flex items-center justify-center p-4"
            onClick={() => setShowColorPicker(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="backdrop-blur-3xl bg-[#FEE6EA]/95 border-2 border-white/30 rounded-2xl shadow-[0_16px_64px_0_rgba(0,0,0,0.15)] p-6 max-w-md w-full"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Add Color</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowColorPicker(false)}
                  className="h-8 w-8 p-0 rounded-full hover:bg-white/20"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <input
                type="color"
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                className="w-full h-24 rounded-lg cursor-pointer focus:outline-none mb-3"
                autoFocus
              />
              
              <div className="flex gap-2 mb-3">
                <input
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  placeholder="#FEE6EA"
                  className="flex-1 p-3 rounded-lg border-2 border-border bg-background/50 backdrop-blur-sm focus:outline-none focus:border-primary transition-colors font-mono text-sm"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={pickColorFromScreen}
                  className="px-3"
                  title="Pick color from screen"
                >
                  <Pipette className="w-4 h-4" />
                </Button>
              </div>
              
              <input
                value={colorLabel}
                onChange={(e) => setColorLabel(e.target.value)}
                placeholder="Color Label"
                className="w-full p-3 rounded-lg border-2 border-border bg-background/50 backdrop-blur-sm focus:outline-none focus:border-primary transition-colors mb-3"
              />
              
              <div className="flex justify-end gap-2 mt-4">
                <Button
                  variant="ghost"
                  onClick={() => setShowColorPicker(false)}
                  className="hover:bg-white/20"
                >
                  Cancel
                </Button>
                <Button
                  onClick={addColor}
                  disabled={!colorLabel.trim()}
                >
                  Add to Canvas
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Screen color picker modal */}
      <AnimatePresence>
        {showScreenPicker && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 flex items-center justify-center p-4"
            onClick={() => setShowScreenPicker(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="backdrop-blur-3xl bg-[#FEE6EA]/95 border-2 border-white/30 rounded-2xl shadow-[0_16px_64px_0_rgba(0,0,0,0.15)] p-6 max-w-md w-full"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Picked Color</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowScreenPicker(false);
                    setColorLabel('');
                  }}
                  className="h-8 w-8 p-0 rounded-full hover:bg-white/20"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div 
                className="w-full h-24 rounded-lg shadow-md mb-3"
                style={{ backgroundColor: selectedColor }}
              />
              
              <div className="flex gap-2 mb-3">
                <input
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  placeholder="#FEE6EA"
                  className="flex-1 p-3 rounded-lg border-2 border-border bg-background/50 backdrop-blur-sm focus:outline-none focus:border-primary transition-colors font-mono text-sm"
                />
              </div>
              
              <input
                value={colorLabel}
                onChange={(e) => setColorLabel(e.target.value)}
                placeholder="Color Label"
                className="w-full p-3 rounded-lg border-2 border-border bg-background/50 backdrop-blur-sm focus:outline-none focus:border-primary transition-colors mb-3"
                autoFocus
              />
              
              <div className="flex justify-end gap-2 mt-4">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowScreenPicker(false);
                    setColorLabel('');
                  }}
                  className="hover:bg-white/20"
                >
                  Cancel
                </Button>
                <Button
                  onClick={addColor}
                  disabled={!colorLabel.trim()}
                >
                  Add to Canvas
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
