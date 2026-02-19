import { useState, useEffect } from 'react';
import { Button } from '@/app/components/ui/button';
import { motion } from 'motion/react';
import { ExternalLink } from 'lucide-react';
import type { CanvasItem, JourneyData } from '@/app/pages/Studio';
import { useDrag } from 'react-dnd';

interface StepTypographyProps {
  onAddItem: (item: Omit<CanvasItem, 'id' | 'position'>, position?: { x: number, y: number }) => void;
  onAddItemsVertical: (items: Omit<CanvasItem, 'id' | 'position'>[]) => void;
  onNext: () => void;
  journeyData: JourneyData;
  onUpdateJourneyData: (stepKey: string, data: any) => void;
}

interface FontInfo {
  id: string;
  family: string;
  category: 'header' | 'body' | 'display'; // Added 'display' for bold header fonts
  weights: string[];
  style: string; // serif, sans-serif, display
  tags: string[]; // minimal, bold, elegant, etc.
  googleFontsWeights: string; // For Google Fonts URL
  description: string;
}

// Comprehensive font library
const fontLibrary: FontInfo[] = [
  // DISPLAY HEADER FONTS - Extra Bold/Heavy for maximum impact
  {
    id: 'bebas-neue-display',
    family: 'Bebas Neue',
    category: 'display',
    weights: ['400'],
    googleFontsWeights: '400',
    style: 'sans-serif',
    tags: ['bold', 'rebellious', 'edgy', 'sharp', 'strong'],
    description: 'ultra-condensed display, commanding presence',
  },
  {
    id: 'anton-display',
    family: 'Anton',
    category: 'display',
    weights: ['400'],
    googleFontsWeights: '400',
    style: 'sans-serif',
    tags: ['bold', 'rebellious', 'dramatic', 'energetic', 'strong'],
    description: 'single weight impact font, unapologetic boldness',
  },
  {
    id: 'black-ops-one',
    family: 'Black Ops One',
    category: 'display',
    weights: ['400'],
    googleFontsWeights: '400',
    style: 'display',
    tags: ['bold', 'edgy', 'rebellious', 'industrial', 'strong'],
    description: 'military stencil display, powerful statement',
  },
  {
    id: 'alfa-slab-one',
    family: 'Alfa Slab One',
    category: 'display',
    weights: ['400'],
    googleFontsWeights: '400',
    style: 'display',
    tags: ['bold', 'strong', 'dramatic', 'playful', 'vibrant'],
    description: 'contemporary slab serif, heavy impact',
  },
  {
    id: 'archivo-black',
    family: 'Archivo Black',
    category: 'display',
    weights: ['400'],
    googleFontsWeights: '400',
    style: 'sans-serif',
    tags: ['bold', 'strong', 'modern', 'geometric', 'structured'],
    description: 'grotesque sans at maximum weight, pure boldness',
  },
  {
    id: 'ultra',
    family: 'Ultra',
    category: 'display',
    weights: ['400'],
    googleFontsWeights: '400',
    style: 'serif',
    tags: ['bold', 'elegant', 'luxe', 'dramatic', 'sophisticated'],
    description: 'ultra-bold serif, theatrical elegance',
  },
  {
    id: 'righteous-display',
    family: 'Righteous',
    category: 'display',
    weights: ['400'],
    googleFontsWeights: '400',
    style: 'sans-serif',
    tags: ['retro', 'playful', 'quirky', 'vibrant', 'bold'],
    description: 'retro-futuristic heavy weight, distinctive character',
  },
  {
    id: 'bungee',
    family: 'Bungee',
    category: 'display',
    weights: ['400'],
    googleFontsWeights: '400',
    style: 'display',
    tags: ['bold', 'playful', 'vibrant', 'energetic', 'modern'],
    description: 'urban signage typeface, chromatic layering',
  },

  // HEADER FONTS - SERIF
  {
    id: 'playfair',
    family: 'Playfair Display',
    category: 'header',
    weights: ['400', '500', '600', '700', '800', '900'],
    googleFontsWeights: '400;500;600;700;800;900',
    style: 'serif',
    tags: ['elegant', 'sophisticated', 'luxe', 'dramatic'],
    description: 'high-contrast serif with dramatic elegance',
  },
  {
    id: 'libre-baskerville',
    family: 'Libre Baskerville',
    category: 'header',
    weights: ['400', '700'],
    googleFontsWeights: '400;700',
    style: 'serif',
    tags: ['classic', 'professional', 'trustworthy', 'thoughtful'],
    description: 'traditional book typeface, warm and reliable',
  },
  {
    id: 'eb-garamond',
    family: 'EB Garamond',
    category: 'header',
    weights: ['400', '500', '600', '700', '800'],
    googleFontsWeights: '400;500;600;700;800',
    style: 'serif',
    tags: ['scholarly', 'wise', 'thoughtful', 'calm'],
    description: 'refined renaissance letterform, timeless wisdom',
  },
  {
    id: 'merriweather',
    family: 'Merriweather',
    category: 'header',
    weights: ['300', '400', '700', '900'],
    googleFontsWeights: '300;400;700;900',
    style: 'serif',
    tags: ['grounded', 'authentic', 'warm', 'approachable'],
    description: 'sturdy yet friendly serif for digital reading',
  },
  {
    id: 'cormorant-garamond',
    family: 'Cormorant Garamond',
    category: 'header',
    weights: ['300', '400', '500', '600', '700'],
    googleFontsWeights: '300;400;500;600;700',
    style: 'serif',
    tags: ['graceful', 'nurturing', 'soft', 'elegant'],
    description: 'delicate display serif with soft curves',
  },
  
  // HEADER FONTS - SANS-SERIF
  {
    id: 'montserrat',
    family: 'Montserrat',
    category: 'header',
    weights: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
    googleFontsWeights: '100;200;300;400;500;600;700;800;900',
    style: 'sans-serif',
    tags: ['geometric', 'modern', 'bold', 'structured'],
    description: 'geometric sans with urban energy',
  },
  {
    id: 'bebas-neue',
    family: 'Bebas Neue',
    category: 'header',
    weights: ['400'],
    googleFontsWeights: '400',
    style: 'sans-serif',
    tags: ['bold', 'rebellious', 'edgy', 'sharp'],
    description: 'condensed display font with commanding presence',
  },
  {
    id: 'raleway',
    family: 'Raleway',
    category: 'header',
    weights: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
    googleFontsWeights: '100;200;300;400;500;600;700;800;900',
    style: 'sans-serif',
    tags: ['elegant', 'minimal', 'sophisticated', 'clean'],
    description: 'refined sans-serif with elegant proportions',
  },
  {
    id: 'oswald',
    family: 'Oswald',
    category: 'header',
    weights: ['200', '300', '400', '500', '600', '700'],
    googleFontsWeights: '200;300;400;500;600;700',
    style: 'sans-serif',
    tags: ['bold', 'strong', 'dynamic', 'industrial'],
    description: 'condensed gothic rework, powerful headlines',
  },
  {
    id: 'quicksand',
    family: 'Quicksand',
    category: 'header',
    weights: ['300', '400', '500', '600', '700'],
    googleFontsWeights: '300;400;500;600;700',
    style: 'sans-serif',
    tags: ['friendly', 'approachable', 'soft', 'warm'],
    description: 'rounded geometric with gentle personality',
  },
  {
    id: 'anton',
    family: 'Anton',
    category: 'header',
    weights: ['400'],
    googleFontsWeights: '400',
    style: 'sans-serif',
    tags: ['bold', 'rebellious', 'dramatic', 'energetic'],
    description: 'single weight impact font, unapologetic boldness',
  },
  {
    id: 'righteous',
    family: 'Righteous',
    category: 'header',
    weights: ['400'],
    googleFontsWeights: '400',
    style: 'sans-serif',
    tags: ['retro', 'playful', 'quirky', 'vibrant'],
    description: 'retro-futuristic with distinctive character',
  },

  // BODY FONTS - SANS-SERIF
  {
    id: 'inter',
    family: 'Inter',
    category: 'body',
    weights: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
    googleFontsWeights: '100;200;300;400;500;600;700;800;900',
    style: 'sans-serif',
    tags: ['modern', 'clean', 'minimal', 'professional'],
    description: 'designed for screens, optimal legibility',
  },
  {
    id: 'lato',
    family: 'Lato',
    category: 'body',
    weights: ['100', '300', '400', '700', '900'],
    googleFontsWeights: '100;300;400;700;900',
    style: 'sans-serif',
    tags: ['friendly', 'approachable', 'warm', 'versatile'],
    description: 'humanist sans, warm and stable',
  },
  {
    id: 'open-sans',
    family: 'Open Sans',
    category: 'body',
    weights: ['300', '400', '500', '600', '700', '800'],
    googleFontsWeights: '300;400;500;600;700;800',
    style: 'sans-serif',
    tags: ['neutral', 'clean', 'professional', 'trustworthy'],
    description: 'neutral clarity with excellent readability',
  },
  {
    id: 'roboto',
    family: 'Roboto',
    category: 'body',
    weights: ['100', '300', '400', '500', '700', '900'],
    googleFontsWeights: '100;300;400;500;700;900',
    style: 'sans-serif',
    tags: ['modern', 'geometric', 'structured', 'clean'],
    description: 'dual nature, mechanical yet friendly',
  },
  {
    id: 'nunito',
    family: 'Nunito',
    category: 'body',
    weights: ['200', '300', '400', '500', '600', '700', '800', '900'],
    googleFontsWeights: '200;300;400;500;600;700;800;900',
    style: 'sans-serif',
    tags: ['friendly', 'soft', 'approachable', 'nurturing'],
    description: 'rounded terminals, balanced and warm',
  },
  {
    id: 'work-sans',
    family: 'Work Sans',
    category: 'body',
    weights: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
    googleFontsWeights: '100;200;300;400;500;600;700;800;900',
    style: 'sans-serif',
    tags: ['clean', 'professional', 'minimal', 'thoughtful'],
    description: 'optimized for screen use, clear and utilitarian',
  },
  {
    id: 'source-sans-pro',
    family: 'Source Sans Pro',
    category: 'body',
    weights: ['200', '300', '400', '600', '700', '900'],
    googleFontsWeights: '200;300;400;600;700;900',
    style: 'sans-serif',
    tags: ['professional', 'neutral', 'trustworthy', 'clean'],
    description: 'first adobe open source typeface, versatile clarity',
  },
  {
    id: 'mukta',
    family: 'Mukta',
    category: 'body',
    weights: ['200', '300', '400', '500', '600', '700', '800'],
    googleFontsWeights: '200;300;400;500;600;700;800',
    style: 'sans-serif',
    tags: ['friendly', 'approachable', 'soft', 'warm'],
    description: 'minimalist yet warm, open counters',
  },
];

// Smart font recommendation engine
function recommendFonts(archetype: string, visualAdjectives: string[]): {
  headers: FontInfo[];
  bodies: FontInfo[];
} {
  const allAdjectives = visualAdjectives.map(a => a.toLowerCase());
  
  // Score each font based on tag overlap
  const scoreFont = (font: FontInfo): number => {
    let score = 0;
    
    // Match visual lab adjectives
    for (const adj of allAdjectives) {
      if (font.tags.some(tag => tag.includes(adj) || adj.includes(tag))) {
        score += 2;
      }
    }
    
    // Archetype bonuses
    if (archetype === 'creator') {
      if (font.tags.includes('innovative') || font.tags.includes('expressive')) score += 1;
    } else if (archetype === 'sage') {
      if (font.tags.includes('wise') || font.tags.includes('thoughtful') || font.tags.includes('scholarly')) score += 1;
    } else if (archetype === 'rebel') {
      if (font.tags.includes('rebellious') || font.tags.includes('bold') || font.tags.includes('edgy')) score += 1;
    } else if (archetype === 'caregiver') {
      if (font.tags.includes('nurturing') || font.tags.includes('warm') || font.tags.includes('friendly')) score += 1;
    }
    
    return score;
  };

  // Get 1 experimental/display font (bold, retro, quirky, etc.)
  const displayFonts = fontLibrary
    .filter(f => f.category === 'display')
    .map(font => ({ font, score: scoreFont(font) }))
    .sort((a, b) => b.score - a.score);
  
  const experimentalFont = displayFonts.length > 0 ? displayFonts[0].font : null;

  // Get 2 regular header fonts
  const regularHeaders = fontLibrary
    .filter(f => f.category === 'header')
    .map(font => ({ font, score: scoreFont(font) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 2)
    .map(item => item.font);

  // Combine into 3 header fonts (1 experimental + 2 regular)
  const headers = experimentalFont ? [experimentalFont, ...regularHeaders] : regularHeaders;

  // Get 3 body fonts
  const bodies = fontLibrary
    .filter(f => f.category === 'body')
    .map(font => ({ font, score: scoreFont(font) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(item => item.font);

  return { headers, bodies };
}

interface FontCardProps {
  font: FontInfo;
  onDragStart: () => void;
  isSelected?: boolean;
  onSelect?: () => void;
}

function FontCard({ font, onDragStart, isSelected = false, onSelect }: FontCardProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'TYPOGRAPHY',
    item: { font },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [font]);

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
    : font.category === 'display'
    ? '400' // Display fonts are already bold/heavy
    : '400';

  const googleFontsUrl = `https://fonts.google.com/specimen/${font.family.replace(/\s+/g, '+')}`;

  return (
    <div
      ref={drag}
      onClick={() => onSelect?.()}
      className={`relative backdrop-blur-3xl bg-white/80 border rounded-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.08)] p-6 cursor-pointer transition-all hover:shadow-[0_12px_48px_0_rgba(0,0,0,0.12)] hover:scale-[1.02] ${
        isDragging ? 'opacity-50' : 'opacity-100'
      } ${
        isSelected ? 'border-primary' : 'border-white/40'
      }`}
      onMouseDown={onDragStart}
    >
      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute top-3 right-12 bg-primary text-primary-foreground rounded-full px-2 py-1 text-xs font-medium">
          Selected
        </div>
      )}

      {/* Category badge */}
      <div className="absolute top-3 left-3">
        <span className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary border border-primary/20 capitalize">
          {font.category}
        </span>
      </div>

      {/* Font preview */}
      <div className="mt-8 mb-6">
        <div
          className={`${font.category === 'display' ? 'text-5xl' : font.category === 'header' ? 'text-4xl' : 'text-xl'} mb-2`}
          style={{
            fontFamily: font.family,
            fontWeight: recommendedWeight,
          }}
        >
          {font.category === 'body' ? 'The quick brown fox jumps over' : 'Your Brand'}
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
            {font.weights.map((weight) => (
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
          {font.tags.slice(0, 4).map((tag, idx) => (
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

      {/* Drag indicator */}
      <div className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center text-foreground/30">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <circle cx="4" cy="4" r="1.5" />
          <circle cx="4" cy="8" r="1.5" />
          <circle cx="4" cy="12" r="1.5" />
          <circle cx="8" cy="4" r="1.5" />
          <circle cx="8" cy="8" r="1.5" />
          <circle cx="8" cy="12" r="1.5" />
          <circle cx="12" cy="4" r="1.5" />
          <circle cx="12" cy="8" r="1.5" />
          <circle cx="12" cy="12" r="1.5" />
        </svg>
      </div>
    </div>
  );
}

export function StepTypography({ onAddItem, onAddItemsVertical, onNext, journeyData, onUpdateJourneyData }: StepTypographyProps) {
  const [primaryArchetype, setPrimaryArchetype] = useState<string>('creator');
  const [visualAdjectives, setVisualAdjectives] = useState<string[]>([]);
  const [recommendedFonts, setRecommendedFonts] = useState<{ headers: FontInfo[]; bodies: FontInfo[] }>({
    headers: [],
    bodies: [],
  });
  const [selectedHeaderFont, setSelectedHeaderFont] = useState<FontInfo | null>(null);
  const [selectedBodyFont, setSelectedBodyFont] = useState<FontInfo | null>(null);

  useEffect(() => {
    // Get archetype and visual lab data from session storage
    if (typeof window !== 'undefined') {
      const storedArchetype = sessionStorage.getItem('primaryArchetype');
      const storedAdjectives = sessionStorage.getItem('visualLabAdjectives');
      
      if (storedArchetype) {
        setPrimaryArchetype(storedArchetype);
      }
      
      if (storedAdjectives) {
        try {
          const adjectives = JSON.parse(storedAdjectives);
          setVisualAdjectives(adjectives);
        } catch (e) {
          console.error('Failed to parse visual lab adjectives', e);
        }
      }
    }
  }, []);

  // Recommend fonts when data is loaded
  useEffect(() => {
    if (visualAdjectives.length > 0 || primaryArchetype) {
      const recommended = recommendFonts(primaryArchetype, visualAdjectives);
      setRecommendedFonts(recommended);
    }
  }, [primaryArchetype, visualAdjectives]);

  const handleDragStart = (font: FontInfo) => {
    // Called when dragging starts
  };

  const handleAddFontsAndContinue = () => {
    // Add both selected fonts to canvas vertically stacked
    const itemsToAdd: Omit<CanvasItem, 'id' | 'position'>[] = [];
    
    if (selectedHeaderFont) {
      itemsToAdd.push({
        type: 'typography' as any,
        content: {
          font: selectedHeaderFont,
        },
      });
    }
    
    if (selectedBodyFont) {
      itemsToAdd.push({
        type: 'typography' as any,
        content: {
          font: selectedBodyFont,
        },
      });
    }
    
    // Add all items vertically stacked to the right of existing items
    if (itemsToAdd.length > 0) {
      onAddItemsVertical(itemsToAdd);
    }
    
    // Then proceed to next step
    onNext();
  };

  return (
    <div className="max-w-5xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Typography Lab</h2>
        <p className="text-muted-foreground mb-4 text-[16px]">
          These are the fonts curated from your archetype and brand triangle from the Google Fonts library (free to use). Select one font for header and another for body text.
        </p>
      </div>

      {/* Regular Header Fonts */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">Header/Logo Fonts</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Curated typefaces including one experimental option matched to your visual style, plus elegant classics for headlines and branding.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendedFonts.headers.map((font) => (
            <FontCard 
              key={font.id}
              font={font}
              onDragStart={() => handleDragStart(font)}
              isSelected={selectedHeaderFont?.id === font.id}
              onSelect={() => setSelectedHeaderFont(font)}
            />
          ))}
        </div>
      </div>

      {/* Body Fonts */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">Body/Content Fonts</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Readable typefaces optimized for paragraphs and long-form content.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendedFonts.bodies.map((font) => (
            <FontCard 
              key={font.id}
              font={font}
              onDragStart={() => handleDragStart(font)}
              isSelected={selectedBodyFont?.id === font.id}
              onSelect={() => setSelectedBodyFont(font)}
            />
          ))}
        </div>
      </div>

      {/* Continue Button with divider */}
      <div className="flex justify-end pt-6 mt-6 border-t" style={{ borderColor: '#131718' }}>
        <Button 
          onClick={handleAddFontsAndContinue} 
          size="lg"
          disabled={!selectedHeaderFont || !selectedBodyFont}
        >
          Add to Canvas & Continue
        </Button>
      </div>
    </div>
  );
}