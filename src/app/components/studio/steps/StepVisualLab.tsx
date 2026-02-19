import { useState, useEffect, useRef } from 'react';
import { Button } from '@/app/components/ui/button';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ChevronRight, ChevronLeft } from 'lucide-react';
import type { CanvasItem, JourneyData } from '@/app/pages/Studio';
import { useDrag } from 'react-dnd';

interface StepVisualLabProps {
  onAddItem: (item: Omit<CanvasItem, 'id' | 'position'>, position?: { x: number; y: number }) => void;
  onAddItemsVertical: (items: Omit<CanvasItem, 'id' | 'position'>[]) => void;
  onAddItemsHorizontal: (items: Omit<CanvasItem, 'id' | 'position'>[]) => void;
  onNext: () => void;
  journeyData: JourneyData;
  onUpdateJourneyData: (stepKey: string, data: any) => void;
}

interface ImagePair {
  theme: string;
  optionA: {
    url: string;
    label: string;
  };
  optionB: {
    url: string;
    label: string;
  };
}

interface SelectedImage {
  pairIndex: number;
  url: string;
  label: string;
}

// Comprehensive design adjective dictionary with related terms
const adjectiveDictionary: Record<string, string[]> = {
  // Minimalist family
  'minimal': ['minimalist', 'clean', 'simple', 'sleek', 'refined', 'understated'],
  'clean': ['minimal', 'crisp', 'fresh', 'uncluttered', 'pure', 'streamlined'],
  'simple': ['minimal', 'straightforward', 'uncomplicated', 'basic', 'clear'],
  'sleek': ['smooth', 'polished', 'modern', 'streamlined', 'refined'],
  
  // Bold family
  'bold': ['strong', 'striking', 'powerful', 'confident', 'dramatic', 'daring'],
  'strong': ['bold', 'powerful', 'robust', 'solid', 'forceful'],
  'striking': ['bold', 'eye-catching', 'dramatic', 'impressive', 'stunning'],
  'dramatic': ['bold', 'theatrical', 'intense', 'powerful', 'striking'],
  
  // Playful family
  'playful': ['fun', 'whimsical', 'lighthearted', 'quirky', 'cheerful', 'bubbly'],
  'fun': ['playful', 'joyful', 'entertaining', 'lively', 'spirited'],
  'whimsical': ['playful', 'fanciful', 'imaginative', 'quirky', 'dreamy'],
  'quirky': ['playful', 'unconventional', 'unique', 'eccentric', 'offbeat'],
  
  // Elegant family
  'elegant': ['sophisticated', 'refined', 'graceful', 'polished', 'chic', 'classy'],
  'sophisticated': ['elegant', 'refined', 'cultured', 'polished', 'tasteful'],
  'graceful': ['elegant', 'fluid', 'flowing', 'refined', 'balanced'],
  'chic': ['elegant', 'stylish', 'fashionable', 'sophisticated', 'refined'],
  
  // Geometric family
  'geometric': ['structured', 'angular', 'precise', 'ordered', 'mathematical'],
  'structured': ['geometric', 'organized', 'systematic', 'ordered', 'formal'],
  'angular': ['geometric', 'sharp', 'edgy', 'pointed', 'defined'],
  'precise': ['exact', 'accurate', 'meticulous', 'detailed', 'sharp'],
  
  // Organic family
  'organic': ['natural', 'flowing', 'fluid', 'free-form', 'earthy', 'botanical'],
  'natural': ['organic', 'earthy', 'raw', 'authentic', 'unprocessed'],
  'flowing': ['fluid', 'smooth', 'graceful', 'organic', 'continuous'],
  'fluid': ['flowing', 'smooth', 'liquid', 'organic', 'seamless'],
  
  // Vibrant family
  'vibrant': ['colorful', 'energetic', 'lively', 'dynamic', 'bright', 'vivid'],
  'colorful': ['vibrant', 'chromatic', 'vivid', 'bright', 'multicolored'],
  'energetic': ['vibrant', 'dynamic', 'lively', 'active', 'spirited'],
  'dynamic': ['energetic', 'active', 'powerful', 'vibrant', 'kinetic'],
  
  // Soft family
  'soft': ['gentle', 'subtle', 'delicate', 'tender', 'muted', 'pastel'],
  'gentle': ['soft', 'mild', 'subtle', 'calm', 'soothing'],
  'subtle': ['soft', 'understated', 'delicate', 'refined', 'nuanced'],
  'delicate': ['soft', 'subtle', 'fragile', 'refined', 'gentle'],
  
  // Edgy family
  'edgy': ['bold', 'rebellious', 'unconventional', 'daring', 'provocative', 'raw'],
  'rebellious': ['edgy', 'defiant', 'unconventional', 'bold', 'nonconformist'],
  'raw': ['edgy', 'unrefined', 'authentic', 'gritty', 'rough'],
  'gritty': ['raw', 'rough', 'textured', 'urban', 'rugged'],
  
  // Retro family
  'retro': ['vintage', 'nostalgic', 'classic', 'old-school', 'throwback'],
  'vintage': ['retro', 'classic', 'antique', 'timeless', 'nostalgic'],
  'nostalgic': ['retro', 'vintage', 'sentimental', 'reminiscent', 'classic'],
  
  // Modern family
  'modern': ['contemporary', 'current', 'fresh', 'sleek', 'minimalist', 'progressive'],
  'contemporary': ['modern', 'current', 'present-day', 'up-to-date', 'trendy'],
  'futuristic': ['modern', 'forward-thinking', 'innovative', 'sci-fi', 'progressive'],
  
  // Warm family
  'warm': ['cozy', 'inviting', 'friendly', 'welcoming', 'comfortable', 'homey'],
  'cozy': ['warm', 'comfortable', 'snug', 'intimate', 'homey'],
  'inviting': ['warm', 'welcoming', 'friendly', 'approachable', 'open'],
  
  // Professional family
  'professional': ['corporate', 'formal', 'business-like', 'polished', 'serious'],
  'corporate': ['professional', 'business', 'formal', 'institutional', 'official'],
  'formal': ['professional', 'structured', 'traditional', 'conventional', 'proper'],
  
  // Luxe family
  'luxe': ['luxury', 'premium', 'upscale', 'high-end', 'exclusive', 'opulent'],
  'luxury': ['luxe', 'premium', 'deluxe', 'lavish', 'sumptuous'],
  'premium': ['luxe', 'high-end', 'quality', 'exclusive', 'superior'],
  
  // Textural family
  'textured': ['tactile', 'layered', 'dimensional', 'rich', 'complex'],
  'tactile': ['textured', 'touchable', 'tangible', 'physical', 'sensory'],
  'layered': ['textured', 'dimensional', 'complex', 'multifaceted', 'rich'],
  
  // Additional standalone adjectives
  'moody': ['atmospheric', 'dark', 'mysterious', 'dramatic', 'emotive'],
  'atmospheric': ['moody', 'ambient', 'evocative', 'cinematic', 'immersive'],
  'ethereal': ['dreamy', 'otherworldly', 'delicate', 'airy', 'celestial'],
  'dreamy': ['ethereal', 'soft', 'romantic', 'whimsical', 'hazy'],
  'rustic': ['natural', 'rough', 'earthy', 'handmade', 'artisanal'],
  'artisanal': ['handmade', 'crafted', 'authentic', 'rustic', 'bespoke'],
  'industrial': ['raw', 'utilitarian', 'mechanical', 'urban', 'functional'],
  'minimalistic': ['minimal', 'simple', 'sparse', 'unadorned', 'essential'],
  'maximalist': ['abundant', 'ornate', 'rich', 'layered', 'excessive'],
  'monochrome': ['black-and-white', 'grayscale', 'achromatic', 'neutral'],
  'iridescent': ['shimmering', 'pearlescent', 'opalescent', 'luminous', 'reflective'],
  'matte': ['flat', 'non-glossy', 'subdued', 'smooth', 'unreflective'],
  'glossy': ['shiny', 'polished', 'lustrous', 'reflective', 'sleek'],
  'pastel': ['soft', 'muted', 'light', 'gentle', 'pale'],
  'neon': ['bright', 'fluorescent', 'electric', 'vibrant', 'glowing'],
  'earthy': ['natural', 'organic', 'grounded', 'rustic', 'warm'],
  'airy': ['light', 'spacious', 'open', 'breathable', 'ethereal'],
  'dense': ['heavy', 'compact', 'solid', 'thick', 'concentrated'],
  'transparent': ['see-through', 'clear', 'translucent', 'glass-like', 'open'],
  'opaque': ['solid', 'impenetrable', 'dense', 'covered', 'obscured'],
};

// Flatten all adjectives for search
const allAdjectives = Array.from(
  new Set(Object.keys(adjectiveDictionary).concat(...Object.values(adjectiveDictionary)))
).sort();

const imagePairs: ImagePair[] = [
  {
    theme: 'Headphones',
    optionA: {
      url: 'https://images.unsplash.com/photo-1491927570842-0261e477d937?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      label: 'Minimal & Retro',
    },
    optionB: {
      url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
      label: 'Bold & Playful',
    },
  },
  {
    theme: 'Seating',
    optionA: {
      url: 'https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=927&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      label: 'Modern & Cozy',
    },
    optionB: {
      url: 'https://images.unsplash.com/photo-1599696848652-f0ff23bc911f?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      label: 'Retro & Homey',
    },
  },
  {
    theme: 'Fashion',
    optionA: {
      url: 'https://images.unsplash.com/photo-1601762603339-fd61e28b698a?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      label: 'Neutral & Understated',
    },
    optionB: {
      url: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      label: 'Bold & Expressive',
    },
  },
  {
    theme: 'Posters',
    optionA: {
      url: 'https://images.unsplash.com/photo-1705454068298-e203b689c8fb?q=80&w=965&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      label: 'Geometric & Structured',
    },
    optionB: {
      url: 'https://images.unsplash.com/photo-1767473118036-ba27eef0f501?q=80&w=927&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      label: 'Retro & Expressive',
    },
  },
  {
    theme: 'Interiors',
    optionA: {
      url: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      label: 'Airy & Rustic',
    },
    optionB: {
      url: 'https://images.unsplash.com/photo-1663082353060-39c9e86a1088?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsJTIwbW9kZXJuJTIwY2hhaXIlMjBkZXNpZ258ZW58MXx8fHwxNzcxMTEzNTUxfDA&ixlib=rb-4.1.0&q=80&w=1080',
      label: 'Layered & Rich',
    },
  },
  {
    theme: 'Technology',
    optionA: {
      url: 'https://images.unsplash.com/photo-1766503206581-6824e98f49de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmdXR1cmlzdGljJTIwdGVjaCUyMHByb2R1Y3QlMjBkZXNpZ258ZW58MXx8fHwxNzcxMTEzNTU0fDA&ixlib=rb-4.1.0&q=80&w=1080',
      label: 'Futuristic & Sleek',
    },
    optionB: {
      url: 'https://images.unsplash.com/photo-1724627561609-9cd3facba8d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwcmV0cm8lMjBjYW1lcmElMjBhbmFsb2d8ZW58MXx8fHwxNzcxMTEzNTU1fDA&ixlib=rb-4.1.0&q=80&w=1080',
      label: 'Vintage & Analog',
    },
  },
  {
    theme: 'Textures',
    optionA: {
      url: 'https://images.unsplash.com/photo-1512411233342-92208dfe81af?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      label: 'Organic & Natural',
    },
    optionB: {
      url: 'https://images.unsplash.com/photo-1536924491042-b0466800ce46?q=80&w=1364&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      label: 'Hard & Geometric',
    },
  },
  {
    theme: 'Colors',
    optionA: {
      url: 'https://images.unsplash.com/photo-1621769533563-d03ec387788f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2Z0JTIwcGFzdGVsJTIwY29sb3JzJTIwYWVzdGhldGljfGVufDF8fHx8MTc3MTExMzU1Nnww&ixlib=rb-4.1.0&q=80&w=1080',
      label: 'Soft & Pastel',
    },
    optionB: {
      url: 'https://images.unsplash.com/photo-1574472269212-51ce847d7cd9?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      label: 'Neon & Vibrant',
    },
  },
  {
    theme: 'Contrast',
    optionA: {
      url: 'https://images.unsplash.com/photo-1637043756935-c60895cc05df?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      label: 'Monochrome & Stark',
    },
    optionB: {
      url: 'https://images.unsplash.com/photo-1637150899351-0ce1779710c7?q=80&w=921&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      label: 'Playful & Iridescent',
    },
  },
  {
    theme: 'Layouts',
    optionA: {
      url: 'https://images.unsplash.com/photo-1765334666984-ba7dc4853846?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      label: 'Dark & Contrasting',
    },
    optionB: {
      url: 'https://images.unsplash.com/photo-1699206791200-414d95e68450?q=80&w=986&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      label: 'Light & Natural',
    },
  },
  {
    theme: 'Typography',
    optionA: {
      url: 'https://images.unsplash.com/photo-1644352739408-a191ed85e513?q=80&w=2029&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      label: 'Minimal & Elegant',
    },
    optionB: {
      url: 'https://images.unsplash.com/photo-1770581939371-326fc1537f10?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib2xkJTIwZXhwcmVzc2l2ZSUyMHR5cG9ncmFwaHklMjBkZXNpZ258ZW58MXx8fHwxNzcxMjEwMDA3fDA&ixlib=rb-4.1.0&q=80&w=1080',
      label: 'Bold & Expressive',
    },
  },
  {
    theme: 'Patterns',
    optionA: {
      url: 'https://images.unsplash.com/photo-1593570609432-49aae533e98d?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      label: 'Fresh & Bubbly',
    },
    optionB: {
      url: 'https://images.unsplash.com/photo-1556139954-ec19cce61d61?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      label: 'Hot & Flowing',
    },
  },
];

type Round = 'pairs' | 'describe' | 'triangle';

// Component for individual image adjective input with autocomplete
function ImageAdjectiveCard({ 
  image, 
  existingAdjectives,
  onSave 
}: { 
  image: SelectedImage;
  existingAdjectives: string[];
  onSave: (adj1: string, adj2: string) => void;
}) {
  const [adj1, setAdj1] = useState(existingAdjectives[0] || '');
  const [adj2, setAdj2] = useState(existingAdjectives[1] || '');
  const [suggestions1, setSuggestions1] = useState<string[]>([]);
  const [suggestions2, setSuggestions2] = useState<string[]>([]);
  const [showSuggestions1, setShowSuggestions1] = useState(false);
  const [showSuggestions2, setShowSuggestions2] = useState(false);
  const input1Ref = useRef<HTMLInputElement>(null);
  const input2Ref = useRef<HTMLInputElement>(null);
  const dropdown1Ref = useRef<HTMLDivElement>(null);
  const dropdown2Ref = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdown1Ref.current && 
        !dropdown1Ref.current.contains(event.target as Node) &&
        !input1Ref.current?.contains(event.target as Node)
      ) {
        setShowSuggestions1(false);
      }
      if (
        dropdown2Ref.current && 
        !dropdown2Ref.current.contains(event.target as Node) &&
        !input2Ref.current?.contains(event.target as Node)
      ) {
        setShowSuggestions2(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Generate smart suggestions based on input
  const generateSuggestions = (input: string): string[] => {
    if (!input || input.length < 2) return [];

    const inputLower = input.toLowerCase().trim();
    const suggestions: string[] = [];
    const seen = new Set<string>();

    // 1. Exact prefix matches
    const prefixMatches = allAdjectives.filter(adj => 
      adj.toLowerCase().startsWith(inputLower) && adj.toLowerCase() !== inputLower
    );
    prefixMatches.forEach(match => {
      if (!seen.has(match)) {
        suggestions.push(match);
        seen.add(match);
      }
    });

    // 2. Contains matches
    const containsMatches = allAdjectives.filter(adj => 
      adj.toLowerCase().includes(inputLower) && 
      !adj.toLowerCase().startsWith(inputLower) &&
      adj.toLowerCase() !== inputLower
    );
    containsMatches.forEach(match => {
      if (!seen.has(match)) {
        suggestions.push(match);
        seen.add(match);
      }
    });

    // 3. Related words from dictionary (synonyms)
    if (adjectiveDictionary[inputLower]) {
      adjectiveDictionary[inputLower].forEach(related => {
        if (!seen.has(related)) {
          suggestions.push(related);
          seen.add(related);
        }
      });
    }

    // 4. Find words that have the input as a related term
    Object.entries(adjectiveDictionary).forEach(([key, relatedWords]) => {
      if (relatedWords.some(word => word.toLowerCase().includes(inputLower))) {
        if (!seen.has(key)) {
          suggestions.push(key);
          seen.add(key);
        }
      }
    });

    return suggestions.slice(0, 8); // Limit to 8 suggestions
  };

  const handleAdj1Change = (value: string) => {
    const lowerValue = value.toLowerCase();
    setAdj1(lowerValue);
    
    // Generate suggestions
    const newSuggestions = generateSuggestions(lowerValue);
    setSuggestions1(newSuggestions);
    setShowSuggestions1(newSuggestions.length > 0 && lowerValue.length >= 2);
    
    // Auto-save
    if (lowerValue.trim() && adj2.trim()) {
      onSave(lowerValue.trim(), adj2.trim());
    }
  };

  const handleAdj2Change = (value: string) => {
    const lowerValue = value.toLowerCase();
    setAdj2(lowerValue);
    
    // Generate suggestions
    const newSuggestions = generateSuggestions(lowerValue);
    setSuggestions2(newSuggestions);
    setShowSuggestions2(newSuggestions.length > 0 && lowerValue.length >= 2);
    
    // Auto-save
    if (adj1.trim() && lowerValue.trim()) {
      onSave(adj1.trim(), lowerValue.trim());
    }
  };

  const selectSuggestion1 = (suggestion: string) => {
    setAdj1(suggestion);
    setShowSuggestions1(false);
    if (suggestion.trim() && adj2.trim()) {
      onSave(suggestion.trim(), adj2.trim());
    }
    input1Ref.current?.focus();
  };

  const selectSuggestion2 = (suggestion: string) => {
    setAdj2(suggestion);
    setShowSuggestions2(false);
    if (adj1.trim() && suggestion.trim()) {
      onSave(adj1.trim(), suggestion.trim());
    }
    input2Ref.current?.focus();
  };

  // Get related words for current inputs to show as helpers
  const getRelatedWords = (word: string): string[] => {
    if (!word || word.length < 2) return [];
    const related = adjectiveDictionary[word.toLowerCase()];
    return related ? related.slice(0, 4) : [];
  };

  const relatedWords1 = getRelatedWords(adj1);
  const relatedWords2 = getRelatedWords(adj2);

  return (
    <div className="backdrop-blur-2xl bg-card/80 border border-border rounded-2xl p-4">
      <div className="mb-4">
        <img 
          src={image.url} 
          alt={image.label}
          className="w-full aspect-square object-cover rounded-lg shadow-md"
        />
      </div>

      <div className="space-y-3">
        {/* Adjective 1 with Autocomplete */}
        <div className="relative">
          <input
            ref={input1Ref}
            type="text"
            value={adj1}
            onChange={(e) => handleAdj1Change(e.target.value)}
            onFocus={() => {
              if (adj1.length >= 2) {
                const newSuggestions = generateSuggestions(adj1);
                setSuggestions1(newSuggestions);
                setShowSuggestions1(newSuggestions.length > 0);
              }
            }}
            onBlur={() => {
              // Close dropdown when field loses focus
              setTimeout(() => setShowSuggestions1(false), 150);
            }}
            placeholder="first adjective..."
            className="w-full p-2 text-sm rounded-lg border border-border bg-background/50 backdrop-blur-sm focus:outline-none focus:border-primary transition-colors lowercase"
          />
          
          {/* Suggestions Dropdown */}
          {showSuggestions1 && suggestions1.length > 0 && (
            <div 
              ref={dropdown1Ref}
              className="absolute z-50 w-full mt-1 bg-card border border-border rounded-lg shadow-lg overflow-hidden"
            >
              <div className="max-h-48 overflow-y-auto">
                {suggestions1.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => selectSuggestion1(suggestion)}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-muted/50 transition-colors flex items-center justify-between group"
                  >
                    <span className="lowercase">{suggestion}</span>
                    {adjectiveDictionary[suggestion.toLowerCase()] && (
                      <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                        related
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Adjective 2 with Autocomplete */}
        <div className="relative">
          <input
            ref={input2Ref}
            type="text"
            value={adj2}
            onChange={(e) => handleAdj2Change(e.target.value)}
            onFocus={() => {
              if (adj2.length >= 2) {
                const newSuggestions = generateSuggestions(adj2);
                setSuggestions2(newSuggestions);
                setShowSuggestions2(newSuggestions.length > 0);
              }
            }}
            onBlur={() => {
              // Close dropdown when field loses focus
              setTimeout(() => setShowSuggestions2(false), 150);
            }}
            placeholder="second adjective..."
            className="w-full p-2 text-sm rounded-lg border border-border bg-background/50 backdrop-blur-sm focus:outline-none focus:border-primary transition-colors lowercase"
          />
          
          {/* Suggestions Dropdown */}
          {showSuggestions2 && suggestions2.length > 0 && (
            <div 
              ref={dropdown2Ref}
              className="absolute z-50 w-full mt-1 bg-card border border-border rounded-lg shadow-lg overflow-hidden"
            >
              <div className="max-h-48 overflow-y-auto">
                {suggestions2.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => selectSuggestion2(suggestion)}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-muted/50 transition-colors flex items-center justify-between group"
                  >
                    <span className="lowercase">{suggestion}</span>
                    {adjectiveDictionary[suggestion.toLowerCase()] && (
                      <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                        related
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Show adjectives as chips */}
        {(adj1 || adj2) && (
          <div className="flex flex-wrap gap-2 pt-1">
            {adj1 && (
              <span className="px-2 py-1 text-xs rounded-full bg-primary/20 text-primary border border-primary/30 lowercase">
                {adj1}
              </span>
            )}
            {adj2 && (
              <span className="px-2 py-1 text-xs rounded-full bg-primary/20 text-primary border border-primary/30 lowercase">
                {adj2}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function StepVisualLab({ onAddItem, onAddItemsVertical, onAddItemsHorizontal, onNext, journeyData, onUpdateJourneyData }: StepVisualLabProps) {
  const [round, setRound] = useState<Round>('pairs');
  const [selectedImages, setSelectedImages] = useState<SelectedImage[]>([]);
  const [currentDescribeIndex, setCurrentDescribeIndex] = useState(0);
  const [imageAdjectives, setImageAdjectives] = useState<{ [key: number]: string[] }>({});
  const [selectedForTriangle, setSelectedForTriangle] = useState<string[]>([]);
  const [isFiltering, setIsFiltering] = useState(false);
  const [shortlistedAdjectives, setShortlistedAdjectives] = useState<string[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load saved journey data only on mount
  useEffect(() => {
    if (journeyData.visualLab && !isInitialized) {
      const savedData = journeyData.visualLab;
      if (savedData.round) setRound(savedData.round);
      if (savedData.selectedImages) setSelectedImages(savedData.selectedImages);
      if (savedData.currentDescribeIndex !== undefined) setCurrentDescribeIndex(savedData.currentDescribeIndex);
      if (savedData.imageAdjectives) setImageAdjectives(savedData.imageAdjectives);
      if (savedData.selectedForTriangle) setSelectedForTriangle(savedData.selectedForTriangle);
      if (savedData.isFiltering !== undefined) setIsFiltering(savedData.isFiltering);
      if (savedData.shortlistedAdjectives) setShortlistedAdjectives(savedData.shortlistedAdjectives);
      setIsInitialized(true);
    } else {
      setIsInitialized(true);
    }
  }, []);

  // Save journey data whenever state changes
  useEffect(() => {
    if (isInitialized) {
      onUpdateJourneyData('visualLab', {
        round,
        selectedImages,
        currentDescribeIndex,
        imageAdjectives,
        selectedForTriangle,
        isFiltering,
        shortlistedAdjectives,
      });
    }
  }, [round, selectedImages, currentDescribeIndex, imageAdjectives, selectedForTriangle, isFiltering, shortlistedAdjectives, isInitialized]);

  // Scroll to top when round changes
  useEffect(() => {
    const scrollContainer = document.querySelector('[data-scroll-container]');
    if (scrollContainer) {
      scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [round]);

  // Scroll to top when image index changes in Round 2
  useEffect(() => {
    if (round === 'describe') {
      const scrollContainer = document.querySelector('[data-scroll-container]');
      if (scrollContainer) {
        scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, [currentDescribeIndex, round]);

  // Round 1: Select from pair
  const selectImage = (pairIndex: number, option: 'A' | 'B') => {
    const pair = imagePairs[pairIndex];
    const selected = option === 'A' ? pair.optionA : pair.optionB;
    
    // Remove existing selection for this pair if any
    const filteredSelections = selectedImages.filter(img => img.pairIndex !== pairIndex);
    
    setSelectedImages([...filteredSelections, {
      pairIndex,
      url: selected.url,
      label: selected.label,
    }]);
  };

  const isPairSelected = (pairIndex: number): boolean => {
    return selectedImages.some(img => img.pairIndex === pairIndex);
  };

  const getSelectedOption = (pairIndex: number): 'A' | 'B' | null => {
    const selected = selectedImages.find(img => img.pairIndex === pairIndex);
    if (!selected) return null;
    const pair = imagePairs[pairIndex];
    return selected.url === pair.optionA.url ? 'A' : 'B';
  };

  const proceedToDescribe = () => {
    if (selectedImages.length === imagePairs.length) {
      // Sort by pair index to maintain order
      const sorted = [...selectedImages].sort((a, b) => a.pairIndex - b.pairIndex);
      setSelectedImages(sorted);
      setRound('describe');
      setCurrentDescribeIndex(0);
    }
  };

  // Round 2: Navigate through groups of images (4 at a time)
  const currentImagePair = selectedImages.slice(currentDescribeIndex, currentDescribeIndex + 4);
  const totalGroups = Math.ceil(selectedImages.length / 4);
  const currentGroupNumber = Math.floor(currentDescribeIndex / 4) + 1;

  const handleNextPair = () => {
    // Check if all images in current group have 2 adjectives
    const allComplete = currentImagePair.every(img => {
      const adjectives = imageAdjectives[img.pairIndex] || [];
      return adjectives.length === 2;
    });

    if (allComplete && currentDescribeIndex + 4 < selectedImages.length) {
      setCurrentDescribeIndex(currentDescribeIndex + 4);
    } else if (allComplete) {
      // All images described, move to Round 3
      proceedToTriangle();
    }
  };

  const handlePreviousPair = () => {
    if (currentDescribeIndex >= 4) {
      setCurrentDescribeIndex(currentDescribeIndex - 4);
    }
  };

  const saveAdjectives = (pairIndex: number, adj1: string, adj2: string) => {
    if (adj1.trim() && adj2.trim()) {
      setImageAdjectives({
        ...imageAdjectives,
        [pairIndex]: [adj1.trim(), adj2.trim()],
      });
    }
  };

  const proceedToTriangle = () => {
    const allAdjectives = Object.values(imageAdjectives).flat();
    const uniqueAdjectives = Array.from(new Set(allAdjectives));
    
    if (uniqueAdjectives.length > 12) {
      setIsFiltering(true);
    }
    setRound('triangle');
  };

  // Round 3: Brand Triangle
  const toggleTriangleSelection = (adjective: string) => {
    if (selectedForTriangle.includes(adjective)) {
      setSelectedForTriangle(selectedForTriangle.filter(a => a !== adjective));
    } else if (selectedForTriangle.length < 3) {
      setSelectedForTriangle([...selectedForTriangle, adjective]);
    }
  };

  const toggleShortlistSelection = (adjective: string) => {
    if (shortlistedAdjectives.includes(adjective)) {
      setShortlistedAdjectives(shortlistedAdjectives.filter(a => a !== adjective));
    } else if (shortlistedAdjectives.length < 6) {
      setShortlistedAdjectives([...shortlistedAdjectives, adjective]);
    }
  };

  const completeShortlist = () => {
    setIsFiltering(false);
  };

  const completeVisualLab = () => {
    // Store selected adjectives for Typography Lab
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('visualLabAdjectives', JSON.stringify(selectedForTriangle));
    }

    // For each selected adjective, find the image it came from and create items array
    const items: Omit<CanvasItem, 'id' | 'position'>[] = [];

    selectedForTriangle.forEach((adjective) => {
      const normalizedAdjective = adjective.toLowerCase().trim();
      
      // Find which image this adjective came from
      for (const [pairIndexStr, adjectives] of Object.entries(imageAdjectives)) {
        const normalizedAdjectives = adjectives.map(a => a.toLowerCase().trim());
        
        if (normalizedAdjectives.includes(normalizedAdjective)) {
          const pairIndex = parseInt(pairIndexStr);
          const sourceImage = selectedImages.find(img => img.pairIndex === pairIndex);
          
          if (sourceImage) {
            // Add to items array
            items.push({
              type: 'image',
              content: {
                url: sourceImage.url,
                caption: normalizedAdjective,
              },
            });
          }
          break;
        }
      }
    });

    // Add all items horizontally next to each other to the right of existing items
    onAddItemsHorizontal(items);

    // Continue to next step
    onNext();
  };

  const allAdjectivesList = Object.values(imageAdjectives).flat();
  const uniqueAdjectivesList = Array.from(new Set(allAdjectivesList));
  const displayAdjectives = isFiltering ? uniqueAdjectivesList : (shortlistedAdjectives.length > 0 ? shortlistedAdjectives : uniqueAdjectivesList);

  return (
    <div className="max-w-5xl">
      {/* Round 1: Visual Preferences */}
      {round === 'pairs' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-semibold">Visual Lab: Round 1</h2>
              <span className="text-sm text-muted-foreground">
                {selectedImages.length} of {imagePairs.length} selected
              </span>
            </div>
            <p className="text-muted-foreground">
              Pick one from each pair that feels more like your style or aesthetic vibe. Don't overthink and let your intuition guide you!
            </p>
          </div>

          {/* Grid with 4 images per row (2 pairs) */}
          <div className="space-y-3">
            {Array.from({ length: Math.ceil(imagePairs.length / 2) }).map((_, rowIndex) => {
              const pair1Index = rowIndex * 2;
              const pair2Index = rowIndex * 2 + 1;
              const pair1 = imagePairs[pair1Index];
              const pair2 = imagePairs[pair2Index];
              
              return (
                <div key={rowIndex} className="grid grid-cols-4 gap-3">
                  {/* Pair 1 - Option A */}
                  <motion.button
                    onClick={() => selectImage(pair1Index, 'A')}
                    className={`
                      group relative overflow-hidden rounded-[10px] bg-card border transition-all cursor-pointer
                      ${getSelectedOption(pair1Index) === 'A' 
                        ? 'border-primary' 
                        : getSelectedOption(pair1Index) === 'B'
                        ? 'border-border opacity-50'
                        : 'border-border hover:border-primary'
                      }
                    `}
                    whileHover={{ scale: getSelectedOption(pair1Index) === 'B' ? 1 : 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="aspect-[3/4] relative">
                      <img 
                        src={pair1.optionA.url} 
                        alt={pair1.optionA.label}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0" />
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <p className="text-white text-sm font-medium">{pair1.optionA.label}</p>
                      </div>
                      {getSelectedOption(pair1Index) === 'A' && (
                        <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                            ✓
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.button>

                  {/* Pair 1 - Option B */}
                  <motion.button
                    onClick={() => selectImage(pair1Index, 'B')}
                    className={`
                      group relative overflow-hidden rounded-[10px] bg-card border transition-all cursor-pointer
                      ${getSelectedOption(pair1Index) === 'B' 
                        ? 'border-primary' 
                        : getSelectedOption(pair1Index) === 'A'
                        ? 'border-border opacity-50'
                        : 'border-border hover:border-primary'
                      }
                    `}
                    whileHover={{ scale: getSelectedOption(pair1Index) === 'A' ? 1 : 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="aspect-[3/4] relative">
                      <img 
                        src={pair1.optionB.url} 
                        alt={pair1.optionB.label}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0" />
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <p className="text-white text-sm font-medium">{pair1.optionB.label}</p>
                      </div>
                      {getSelectedOption(pair1Index) === 'B' && (
                        <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                            ✓
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.button>

                  {/* Pair 2 - Option A (if exists) */}
                  {pair2 && (
                    <motion.button
                      onClick={() => selectImage(pair2Index, 'A')}
                      className={`
                        group relative overflow-hidden rounded-[10px] bg-card border transition-all cursor-pointer
                        ${getSelectedOption(pair2Index) === 'A' 
                          ? 'border-primary' 
                          : getSelectedOption(pair2Index) === 'B'
                          ? 'border-border opacity-50'
                          : 'border-border hover:border-primary'
                        }
                      `}
                      whileHover={{ scale: getSelectedOption(pair2Index) === 'B' ? 1 : 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="aspect-[3/4] relative">
                        <img 
                          src={pair2.optionA.url} 
                          alt={pair2.optionA.label}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0" />
                        <div className="absolute bottom-0 left-0 right-0 p-3">
                          <p className="text-white text-sm font-medium">{pair2.optionA.label}</p>
                        </div>
                        {getSelectedOption(pair2Index) === 'A' && (
                          <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                            <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                              ✓
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.button>
                  )}

                  {/* Pair 2 - Option B (if exists) */}
                  {pair2 && (
                    <motion.button
                      onClick={() => selectImage(pair2Index, 'B')}
                      className={`
                        group relative overflow-hidden rounded-[10px] bg-card border transition-all cursor-pointer
                        ${getSelectedOption(pair2Index) === 'B' 
                          ? 'border-primary' 
                          : getSelectedOption(pair2Index) === 'A'
                          ? 'border-border opacity-50'
                          : 'border-border hover:border-primary'
                        }
                      `}
                      whileHover={{ scale: getSelectedOption(pair2Index) === 'A' ? 1 : 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="aspect-[3/4] relative">
                        <img 
                          src={pair2.optionB.url} 
                          alt={pair2.optionB.label}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0" />
                        <div className="absolute bottom-0 left-0 right-0 p-3">
                          <p className="text-white text-sm font-medium">{pair2.optionB.label}</p>
                        </div>
                        {getSelectedOption(pair2Index) === 'B' && (
                          <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                            <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                              ✓
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.button>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex justify-between items-center pt-6 mt-6 border-t border-[#131718]">
            <p className="text-sm text-muted-foreground">
              {selectedImages.length}/{imagePairs.length} pairs selected
            </p>
            <Button
              onClick={proceedToDescribe}
              disabled={selectedImages.length !== imagePairs.length}
            >
              Proceed to Round 2
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </motion.div>
      )}

      {/* Round 2: Describe Your Picks */}
      {round === 'describe' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-semibold">Visual Lab: Round 2</h2>
              <span className="text-sm text-muted-foreground">
                Group {currentGroupNumber} of {totalGroups}
              </span>
            </div>
            <p className="text-muted-foreground">
              Add 2 adjectives to describe each image that first pop in your mind.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {currentImagePair.map((image, imageIndex) => {
              const existingAdjectives = imageAdjectives[image.pairIndex] || [];
              return (
                <ImageAdjectiveCard
                  key={`${image.pairIndex}-${currentDescribeIndex}`}
                  image={image}
                  existingAdjectives={existingAdjectives}
                  onSave={(adj1, adj2) => saveAdjectives(image.pairIndex, adj1, adj2)}
                />
              );
            })}
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-[#131718]">
            <Button
              variant="ghost"
              onClick={() => {
                setRound('pairs');
                setCurrentDescribeIndex(0);
              }}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Round 1
            </Button>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                onClick={handlePreviousPair}
                disabled={currentDescribeIndex === 0}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous Group
              </Button>
              <Button
                onClick={handleNextPair}
                disabled={!currentImagePair.every(img => {
                  const adjectives = imageAdjectives[img.pairIndex] || [];
                  return adjectives.length === 2;
                })}
              >
                {currentDescribeIndex + 4 < selectedImages.length ? 'Next Group' : 'Complete Round 2'}
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Round 3: Brand Triangle */}
      {round === 'triangle' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">Visual Lab: Round 3</h2>
            <p className="text-muted-foreground">
              {isFiltering 
                ? 'Now, let\'s shortlist up to 6 adjectives that feel the strongest to you and best describe you/your brand.'
                : shortlistedAdjectives.length > 0
                ? 'Now, let\'s pick the three adjective that represent you the most. Those will define your brand triangle.'
                : 'Now, let\'s pick the three adjective that represent you the most. Those will define your brand triangle.'
              }
            </p>
          </div>

          {/* Selected Triangle Preview */}
          {!isFiltering && selectedForTriangle.length > 0 && (
            <div className="mb-6 backdrop-blur-2xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/30 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="font-semibold">Your Brand Triangle</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {selectedForTriangle.map((adj, idx) => {
                  // Find the image this adjective came from
                  let sourceImage: SelectedImage | undefined;
                  for (const [pairIndexStr, adjectives] of Object.entries(imageAdjectives)) {
                    const normalizedAdjectives = adjectives.map(a => a.toLowerCase().trim());
                    if (normalizedAdjectives.includes(adj.toLowerCase().trim())) {
                      const pairIndex = parseInt(pairIndexStr);
                      sourceImage = selectedImages.find(img => img.pairIndex === pairIndex);
                      break;
                    }
                  }
                  
                  return (
                    <DraggableTriangleCard
                      key={idx}
                      adjective={adj}
                      imageUrl={sourceImage?.url}
                    />
                  );
                })}
                {Array.from({ length: 3 - selectedForTriangle.length }).map((_, idx) => (
                  <div
                    key={`empty-${idx}`}
                    className="backdrop-blur-2xl bg-card/80 border border-dashed border-border rounded-lg p-3 flex flex-col items-center justify-center aspect-square"
                  >
                    <span className="text-4xl text-muted-foreground">?</span>
                    <p className="text-xs text-muted-foreground mt-2">select word</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Adjective chips */}
          <div className="backdrop-blur-2xl bg-card/80 border border-border rounded-2xl p-6 mb-6">
            <h3 className="font-semibold mb-4">
              {isFiltering ? 'All Your Adjectives - Click to select' : 'Your Shortlist'}
            </h3>
            <div className="flex flex-wrap gap-3">
              {displayAdjectives.map((adj, idx) => {
                const isSelected = isFiltering 
                  ? shortlistedAdjectives.includes(adj)
                  : selectedForTriangle.includes(adj);
                const isDisabled = isFiltering 
                  ? !shortlistedAdjectives.includes(adj) && shortlistedAdjectives.length >= 6
                  : !selectedForTriangle.includes(adj) && selectedForTriangle.length >= 3;

                return (
                  <button
                    key={idx}
                    onClick={() => isFiltering ? toggleShortlistSelection(adj) : toggleTriangleSelection(adj)}
                    disabled={isDisabled}
                    className={`
                      px-4 py-2 rounded-full text-sm font-medium transition-all
                      ${isSelected
                        ? 'bg-primary text-primary-foreground shadow-md scale-105'
                        : 'bg-muted hover:bg-muted/80 text-foreground'
                      }
                      ${isDisabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
                    `}
                  >
                    {adj}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-[#131718]">
            <Button
              variant="ghost"
              onClick={() => {
                setRound('describe');
                setCurrentDescribeIndex(0);
              }}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Round 2
            </Button>
            <div className="flex items-center gap-4">
              <p className="text-sm text-muted-foreground">
                {isFiltering 
                  ? `${shortlistedAdjectives.length}/6 shortlisted`
                  : `${selectedForTriangle.length}/3 selected`
                }
              </p>
              {isFiltering ? (
                <Button
                  onClick={completeShortlist}
                  disabled={shortlistedAdjectives.length === 0}
                >
                  Continue to Final Selection
                </Button>
              ) : (
                <Button
                  onClick={completeVisualLab}
                  disabled={selectedForTriangle.length !== 3}
                >
                  Add to Canvas & Continue
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// Draggable Triangle Card Component
function DraggableTriangleCard({ adjective, imageUrl }: { adjective: string, imageUrl?: string }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'IMAGE',
    item: {
      type: 'image',
      content: {
        url: imageUrl,
        caption: adjective.toLowerCase().trim(),
      },
      isNew: true,
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`
        backdrop-blur-2xl bg-card/80 border border-border rounded-lg p-3 cursor-move transition-opacity
        ${isDragging ? 'opacity-50' : 'hover:border-primary/50'}
      `}
    >
      {imageUrl && (
        <img
          src={imageUrl}
          alt={adjective}
          className="w-full aspect-square object-cover rounded mb-2"
        />
      )}
      <p className="text-center text-lg font-medium lowercase">{adjective}</p>
    </div>
  );
}