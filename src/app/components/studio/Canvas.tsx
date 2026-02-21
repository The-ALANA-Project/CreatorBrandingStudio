import { useRef, useState, useCallback, useEffect } from 'react';
import { useDrop } from 'react-dnd';
import { DraggableCanvasItem } from './DraggableCanvasItem';
import type { CanvasItem } from '@/app/pages/Studio';
import { Home, ZoomIn, ZoomOut, Download, Upload, FileJson, FileImage, FileText, Trash2, Type, StickyNote, Palette, Link, ImagePlus } from 'lucide-react';

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
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [isLoadingLinkPreview, setIsLoadingLinkPreview] = useState(false);
  const downloadMenuRef = useRef<HTMLDivElement>(null);
  const uploadMenuRef = useRef<HTMLDivElement>(null);
  const clearMenuRef = useRef<HTMLDivElement>(null);
  const linkModalRef = useRef<HTMLDivElement>(null);

  // Detect if user is on Mac/iOS for trackpad support
  const isMac = useRef(
    typeof navigator !== 'undefined' && 
    (navigator.platform.toUpperCase().indexOf('MAC') >= 0 || 
     navigator.platform.toUpperCase().indexOf('IPHONE') >= 0 ||
     navigator.platform.toUpperCase().indexOf('IPAD') >= 0)
  ).current;

  // Snap to grid helper function (24px grid)
  const snapToGrid = (x: number, y: number) => {
    const gridSize = 12; // Tighter grid for easier positioning
    // Snap to grid intersections (dots are at 0, 12, 24, etc.)
    return {
      x: Math.round(x / gridSize) * gridSize,
      y: Math.round(y / gridSize) * gridSize,
    };
  };

  // Handle mouse wheel for zooming and panning (Mac trackpad support)
  const handleWheel = useCallback((e: React.WheelEvent) => {
    // Zoom with ctrl/cmd key (all platforms)
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = -e.deltaY;
      const zoomSensitivity = 0.001;
      const newScale = Math.min(Math.max(0.1, scale + delta * zoomSensitivity), 3);
      setScale(newScale);
    } 
    // Pan with trackpad on Mac (natural two-finger scroll)
    else if (isMac) {
      e.preventDefault();
      setPan(prev => ({
        x: prev.x - e.deltaX,
        y: prev.y - e.deltaY,
      }));
    }
  }, [scale, isMac]);

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
      onAddItem({
        type: 'text',
        content: {
          text: 'Title',
          isTitle: true,
        },
      }); // Let Studio.tsx handle positioning with getRightmostPosition()
    }
  }, [onAddItem]);

  // Add Note handler
  const handleAddNote = useCallback(() => {
    if (onAddItem) {
      onAddItem({
        type: 'text',
        content: {
          text: 'Note',
          isTitle: false,
        },
      }); // Let Studio.tsx handle positioning with getRightmostPosition()
    }
  }, [onAddItem]);

  // Add Color Card handler
  const handleAddColorCard = useCallback(() => {
    if (onAddItem) {
      onAddItem({
        type: 'color',
        content: {
          color: '#FEE6EA',
          label: 'Color',
        },
      }); // Let Studio.tsx handle positioning with getRightmostPosition()
    }
  }, [onAddItem]);

  // Add Link Card handler
  const handleAddLinkCard = useCallback(() => {
    setShowLinkModal(true);
    setLinkUrl('');
  }, []);

  // Extract domain and title from any URL
  const extractUrlInfo = (url: string): { domain: string; title: string; displayUrl: string } => {
    try {
      const urlObj = new URL(url);
      const domain = urlObj.hostname.replace('www.', '');
      
      // Extract title from path
      let title = 'Reference Link';
      const pathParts = urlObj.pathname.split('/').filter(part => part.length > 0);
      
      if (domain.includes('behance.net')) {
        const match = url.match(/\/gallery\/\d+\/([\w-]+)/);
        if (match && match[1]) {
          title = match[1].split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' ');
        }
      } else if (domain.includes('dribbble.com')) {
        if (pathParts.length > 1) {
          title = pathParts[1].split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' ');
        }
      } else if (domain.includes('pinterest.com')) {
        if (pathParts.length > 1) {
          title = pathParts[pathParts.length - 1].split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' ');
        }
      } else if (pathParts.length > 0) {
        // Generic: use last path segment
        title = pathParts[pathParts.length - 1]
          .replace(/[-_]/g, ' ')
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
      } else {
        title = domain.split('.')[0].charAt(0).toUpperCase() + domain.split('.')[0].slice(1);
      }
      
      return {
        domain,
        title,
        displayUrl: `${domain}${urlObj.pathname.substring(0, 40)}${urlObj.pathname.length > 40 ? '...' : ''}`,
      };
    } catch (e) {
      return {
        domain: url,
        title: 'Link',
        displayUrl: url,
      };
    }
  };

  // Fetch link preview using microlink.io free API
  const fetchLinkPreview = async (url: string): Promise<{
    domain: string;
    title: string;
    displayUrl: string;
    image?: string;
    description?: string;
  }> => {
    try {
      const urlObj = new URL(url);
      const domain = urlObj.hostname.replace('www.', '');
      
      // Use microlink.io with simplified parameters for better success rate
      const apiUrl = `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&meta=false&palette=false&audio=false&video=false`;
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        console.warn(`Microlink API returned ${response.status}, using fallback`);
        return extractUrlInfo(url);
      }

      const data = await response.json();

      if (data.status === 'success' && data.data) {
        // Prioritize the largest, most relevant image
        let imageUrl = undefined;
        
        // 1. First try: og:image or main image (usually the hero/cover image)
        if (data.data.image?.url) {
          imageUrl = data.data.image.url;
        }
        
        // 2. Try screenshot for visual preview
        if (!imageUrl && data.data.screenshot?.url) {
          imageUrl = data.data.screenshot.url;
        }
        
        // 3. Last resort: use logo if it's reasonably sized
        if (!imageUrl && data.data.logo?.url) {
          const logoWidth = data.data.logo?.width || 0;
          const logoHeight = data.data.logo?.height || 0;
          
          if (logoWidth > 100 || logoHeight > 100) {
            imageUrl = data.data.logo.url;
          }
        }
        
        return {
          domain,
          title: data.data.title || extractUrlInfo(url).title,
          displayUrl: `${domain}${urlObj.pathname.substring(0, 40)}${urlObj.pathname.length > 40 ? '...' : ''}`,
          image: imageUrl,
          description: data.data.description,
        };
      } else {
        console.warn('Microlink returned unsuccessful status:', data.status);
        return extractUrlInfo(url);
      }
    } catch (error) {
      console.error('Error fetching preview:', error);
      // Fallback to basic extraction
      return extractUrlInfo(url);
    }
  };

  // Submit link card
  const handleSubmitLink = useCallback(async () => {
    if (onAddItem && linkUrl.trim()) {
      setIsLoadingLinkPreview(true);
      try {
        // Normalize URL
        const normalizedUrl = linkUrl.startsWith('http') ? linkUrl : `https://${linkUrl}`;
        
        // Check if it's a direct image URL
        const isDirectImage = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(normalizedUrl);
        
        if (isDirectImage) {
          // For direct image URLs, just use the URL as both link and image
          const { domain, title, displayUrl } = extractUrlInfo(normalizedUrl);
          
          onAddItem({
            type: 'link',
            content: {
              url: normalizedUrl,
              title,
              domain,
              displayUrl,
              image: normalizedUrl,
            },
          });
          
          setShowLinkModal(false);
          setLinkUrl('');
          setIsLoadingLinkPreview(false);
          return;
        }

        // For regular URLs, fetch metadata and preview
        const previewData = await fetchLinkPreview(normalizedUrl);
        
        onAddItem({
          type: 'link',
          content: {
            url: normalizedUrl,
            title: previewData.title,
            domain: previewData.domain,
            displayUrl: previewData.displayUrl,
            image: previewData.image,
            description: previewData.description,
          },
        });
        
        setShowLinkModal(false);
        setLinkUrl('');
        setIsLoadingLinkPreview(false);
      } catch (e) {
        // If URL parsing fails, just use the input as-is
        onAddItem({
          type: 'link',
          content: {
            url: linkUrl,
            title: 'Link',
            domain: linkUrl,
            displayUrl: linkUrl,
          },
        });
        
        setShowLinkModal(false);
        setLinkUrl('');
        setIsLoadingLinkPreview(false);
      }
    }
  }, [onAddItem, linkUrl]);

  // Add Image handler (from device upload)
  const handleAddImageFromDevice = useCallback(() => {
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
            onAddItem({
              type: 'image',
              content: {
                url: imageUrl,
                alt: file.name,
              },
            }); // Let Studio.tsx handle positioning with getRightmostPosition()
          }
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  }, [onAddItem]);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: ['CARD', 'IMAGE', 'TEXT', 'COLOR', 'FONT_PAIRING', 'TYPOGRAPHY', 'LINK'],
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
    const currentRef = linkModalRef.current;
    const handleClickOutside = (event: MouseEvent) => {
      if (currentRef && !currentRef.contains(event.target as Node)) {
        setShowLinkModal(false);
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
        cursor: isMac ? 'default' : (isPanning ? 'grabbing' : 'grab'),
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
          <div className="backdrop-blur-3xl border-2 border-white/40 rounded-3xl shadow-[0_16px_64px_0_rgba(0,0,0,0.08)] px-12 py-10 text-center max-w-2xl bg-[#fee6ea]">
            <h3 className="font-bold mb-4 text-foreground text-[25px]">
              Your Brand Canvas Awaits
            </h3>
            <p className="text-foreground/70 text-[#131718] text-[16px]">
              Start your journey by clicking on the bar below to collect cards and build your personal brand.
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
              <Palette className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Add Link Card Button */}
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
              onClick={handleAddLinkCard}
              title="Add Link Card"
            >
              <Link className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Add Image Button */}
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
              onClick={handleAddImageFromDevice}
              title="Add Image"
            >
              <ImagePlus className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Link Modal */}
      {showLinkModal && (
        <div className="absolute top-0 left-0 right-0 bottom-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div 
            ref={linkModalRef}
            className="backdrop-blur-3xl bg-[#FEE6EA]/95 border border-[#131718] rounded-2xl shadow-[0_16px_64px_0_rgba(0,0,0,0.15)] p-6 max-w-md w-full mx-4"
          >
            <h3 className="text-lg font-semibold mb-4">Add Link Card</h3>
            <input
              type="text"
              className="w-full px-4 py-3 text-sm bg-card/80 backdrop-blur-2xl border border-[#131718] rounded-lg focus:outline-none focus:border-[#131718] transition-colors mb-4"
              placeholder="Paste URL here..."
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              onKeyDown={(e) => {
                // Allow Cmd+A / Ctrl+A for select all - stop propagation so it doesn't get intercepted
                if ((e.metaKey || e.ctrlKey) && (e.key.toLowerCase() === 'a')) {
                  e.stopPropagation();
                  return;
                }
                if (e.key === 'Enter' && !isLoadingLinkPreview) {
                  handleSubmitLink();
                } else if (e.key === 'Escape') {
                  setShowLinkModal(false);
                }
              }}
              autoFocus
              disabled={isLoadingLinkPreview}
            />
            {isLoadingLinkPreview && (
              <p className="text-xs text-muted-foreground text-center mb-4">Fetching preview...</p>
            )}
            <div className="flex gap-3">
              <button
                className="flex-1 px-4 py-2.5 bg-[#131718] text-white border border-[#131718] rounded-lg text-sm font-medium hover:bg-[#FEE6EA] hover:text-[#131718] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                onClick={handleSubmitLink}
                disabled={!linkUrl.trim() || isLoadingLinkPreview}
              >
                {isLoadingLinkPreview ? 'Loading...' : 'Add Link'}
              </button>
              <button
                className="flex-1 px-4 py-2.5 bg-white/50 text-foreground rounded-lg text-sm font-medium hover:bg-white/70 transition-all"
                onClick={() => setShowLinkModal(false)}
                disabled={isLoadingLinkPreview}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

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
          
        </div>
      </div>
    </div>
  );
}