import { Button } from '@/app/components/ui/button';
import { useState, useEffect } from 'react';
import { Pipette, Undo2, Redo2 } from 'lucide-react';
import type { CanvasItem, JourneyData } from '@/app/pages/Studio';
import { useDrag } from 'react-dnd';

interface StepColorMappingProps {
  onAddItem: (item: Omit<CanvasItem, 'id' | 'position'>, position?: { x: number; y: number }) => void;
  onAddItemsVertical: (items: Omit<CanvasItem, 'id' | 'position'>[]) => void;
  onNext: () => void;
  journeyData: JourneyData;
  onUpdateJourneyData: (stepKey: string, data: any) => void;
}

interface ColorHistory {
  past: string[];
  current: string;
  future: string[];
}

const DraggableColorChip = ({ 
  color, 
  label, 
  onAddItem,
  showControls = false,
  history,
  onUndo,
  onRedo,
  onColorChange,
}: { 
  color: string; 
  label: string; 
  onAddItem: (item: Omit<CanvasItem, 'id' | 'position'>, position?: { x: number; y: number }) => void;
  showControls?: boolean;
  history?: ColorHistory;
  onUndo?: () => void;
  onRedo?: () => void;
  onColorChange?: (color: string) => void;
}) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'COLOR',
    item: {
      color,
      label,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [color, label]);

  const canUndo = history ? history.past.length > 0 : false;
  const canRedo = history ? history.future.length > 0 : false;

  return (
    <div className="flex-1">
      <div className="relative group">
        <div
          ref={drag}
          className="w-full h-20 rounded-[10px] border border-white/30 relative overflow-hidden transition-transform hover:scale-105 cursor-grab active:cursor-grabbing"
          style={{ 
            backgroundColor: color,
            opacity: isDragging ? 0.5 : 1 
          }}
        >
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
            <span className="text-white text-xs font-medium">Drag</span>
          </div>

          {showControls && (
            <>
              {/* Undo/Redo buttons - Upper Left */}
              <div className="absolute top-2 left-2 flex gap-1.5 pointer-events-auto">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    onUndo?.();
                  }}
                  disabled={!canUndo}
                  className={`transition-all ${
                    canUndo
                      ? 'text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] hover:scale-110'
                      : 'text-white/30 cursor-not-allowed'
                  }`}
                  title="Undo"
                >
                  <Undo2 className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    onRedo?.();
                  }}
                  disabled={!canRedo}
                  className={`transition-all ${
                    canRedo
                      ? 'text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] hover:scale-110'
                      : 'text-white/30 cursor-not-allowed'
                  }`}
                  title="Redo"
                >
                  <Redo2 className="w-4 h-4" />
                </button>
              </div>

              {/* Eyedropper - Upper Right */}
              <label className="absolute top-2 right-2 pointer-events-auto cursor-pointer">
                <input
                  type="color"
                  value={color || '#000000'}
                  onChange={(e) => {
                    e.stopPropagation();
                    onColorChange?.(e.target.value);
                  }}
                  className="sr-only"
                />
                <div className="text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] hover:scale-110 transition-all">
                  <Pipette className="w-4 h-4" />
                </div>
              </label>
            </>
          )}
        </div>
        
        {/* Color Label */}
        <div className="mt-2 text-center">
          <p className="text-xs font-medium text-muted-foreground">
            {label}
          </p>
          {color && (
            <p className="text-[10px] text-muted-foreground/70 mt-0.5 font-mono">
              {color.toUpperCase()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export function StepColorMapping({ onAddItem, onAddItemsVertical, onNext, journeyData, onUpdateJourneyData }: StepColorMappingProps) {
  const [colorHistories, setColorHistories] = useState<ColorHistory[]>([
    { past: [], current: '', future: [] },
    { past: [], current: '', future: [] },
    { past: [], current: '', future: [] },
    { past: [], current: '', future: [] },
    { past: [], current: '', future: [] },
  ]);
  const [secondaryPalette, setSecondaryPalette] = useState<string[]>([]);
  const [tertiaryPalette, setTertiaryPalette] = useState<string[]>([]);
  const [extractedNeutrals, setExtractedNeutrals] = useState<{ color: string; count: number }[]>([]);
  const [extractedAccents, setExtractedAccents] = useState<{ color: string; count: number }[]>([]);
  const [extractedFromVisualLab, setExtractedFromVisualLab] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [regenerationCount, setRegenerationCount] = useState(0);
  const [allExtractedColors, setAllExtractedColors] = useState<{ color: string; count: number; imageIndex: number }[]>([]);
  const [debugData, setDebugData] = useState<{
    imageColors: { imageIndex: number; colors: string[]; imageUrl: string }[];
    neutrals: string[];
    accents: string[];
  } | null>(null);

  const mainColors = colorHistories.map(h => h.current);

  // Load saved journey data only on mount
  useEffect(() => {
    if (journeyData.colorMapping && !isInitialized) {
      if (journeyData.colorMapping.colorHistories) setColorHistories(journeyData.colorMapping.colorHistories);
      if (journeyData.colorMapping.secondaryPalette) setSecondaryPalette(journeyData.colorMapping.secondaryPalette);
      if (journeyData.colorMapping.tertiaryPalette) setTertiaryPalette(journeyData.colorMapping.tertiaryPalette);
      if (journeyData.colorMapping.extractedFromVisualLab !== undefined) setExtractedFromVisualLab(journeyData.colorMapping.extractedFromVisualLab);
      if (journeyData.colorMapping.extractedNeutrals) setExtractedNeutrals(journeyData.colorMapping.extractedNeutrals);
      if (journeyData.colorMapping.extractedAccents) setExtractedAccents(journeyData.colorMapping.extractedAccents);
      if (journeyData.colorMapping.debugData) setDebugData(journeyData.colorMapping.debugData);
      if (journeyData.colorMapping.regenerationCount !== undefined) setRegenerationCount(journeyData.colorMapping.regenerationCount);
      setIsInitialized(true);
    } else {
      setIsInitialized(true);
    }
  }, [journeyData]);

  // Save journey data whenever state changes
  useEffect(() => {
    if (isInitialized) {
      onUpdateJourneyData('colorMapping', {
        colorHistories,
        secondaryPalette,
        tertiaryPalette,
        extractedFromVisualLab,
        extractedNeutrals,
        extractedAccents,
        debugData,
        regenerationCount,
      });
    }
  }, [colorHistories, secondaryPalette, tertiaryPalette, extractedFromVisualLab, extractedNeutrals, extractedAccents, debugData, regenerationCount, isInitialized]);

  // Generate secondary and tertiary palettes when main colors change
  useEffect(() => {
    if (mainColors.filter(c => c && c !== '#131718').length === 5) {
      generateSecondaryPalette();
      generateTertiaryPalette();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colorHistories]);

  const extractColorsFromVisualLab = () => {
    // Get selected images from Visual Lab Round 3 (the 3 final result images)
    const visualLabData = journeyData.visualLab;
    
    console.log('📦 Full Visual Lab Data:', visualLabData);
    
    if (!visualLabData || !visualLabData.selectedImages || visualLabData.selectedImages.length === 0) {
      console.log('No Visual Lab images found, using defaults');
      // Fallback to default colors if no images
      const defaultColors = [
        '#F5E6D3', // neutral 1
        '#D4C4B0', // neutral 2
        '#8B7355', // neutral 3
        '#C47B84', // accent 1
        '#7B9E87', // accent 2
      ];
      setColorHistories(defaultColors.map(color => ({
        past: [],
        current: color,
        future: [],
      })));
      setExtractedFromVisualLab(true);
      return;
    }

    // The 3 final images from Round 3 are determined by selectedForTriangle adjectives
    // We need to find the 3 images that match the selected adjectives
    const selectedForTriangle = visualLabData.selectedForTriangle || [];
    const imageAdjectives = visualLabData.imageAdjectives || {};
    const selectedImages = visualLabData.selectedImages || [];
    
    console.log('🎯 Selected adjectives from Round 3:', selectedForTriangle);
    console.log('📝 Image adjectives mapping:', imageAdjectives);
    console.log('🖼️ All selected images from Round 1:', selectedImages);
    
    // Find the 3 specific images that correspond to the Round 3 selected adjectives
    const finalResultImages: { url: string; adjective: string; pairIndex: number }[] = [];
    
    selectedForTriangle.forEach((adjective: string) => {
      const normalizedAdjective = adjective.toLowerCase().trim();
      
      // Find which image this adjective came from
      for (const [pairIndexStr, adjectives] of Object.entries(imageAdjectives)) {
        const normalizedAdjectives = (adjectives as string[]).map(a => a.toLowerCase().trim());
        
        if (normalizedAdjectives.includes(normalizedAdjective)) {
          const pairIndex = parseInt(pairIndexStr);
          const sourceImage = selectedImages.find((img: any) => img.pairIndex === pairIndex);
          
          if (sourceImage && !finalResultImages.some(img => img.pairIndex === pairIndex)) {
            finalResultImages.push({
              url: sourceImage.url,
              adjective: normalizedAdjective,
              pairIndex: pairIndex,
            });
          }
          break;
        }
      }
    });
    
    console.log('✅ Final 3 result images from Round 3:', finalResultImages);
    
    if (finalResultImages.length === 0) {
      console.warn('⚠️ Could not find final result images, falling back to first 3 selected images');
      // Fallback to first 3 selected images if we can't determine the Round 3 results
      finalResultImages.push(
        ...selectedImages.slice(0, 3).map((img: any, idx: number) => ({
          url: img.url,
          adjective: `Image ${idx + 1}`,
          pairIndex: img.pairIndex,
        }))
      );
    }
    
    const imageUrls = finalResultImages.map(img => img.url);
    console.log('🎨 Extracting colors from these Round 3 result images:', imageUrls);
    
    // Process images and extract colors
    Promise.all(imageUrls.map((url, index) => extractColorsFromImage(url, index)))
      .then(colorArrays => {
        console.log('🎨 Raw color arrays from each image:', colorArrays.map(arr => arr.length));
        
        // Track which colors came from which image
        const colorsByImage: { color: string; count: number; imageIndex: number }[] = [];
        colorArrays.forEach((colors, imageIndex) => {
          colors.forEach(colorData => {
            colorsByImage.push({ ...colorData, imageIndex });
          });
        });
        
        // Store ALL extracted colors for regeneration (we'll use these later)
        setAllExtractedColors(colorsByImage);
        
        console.log('🎨 Total colors from all images:', colorsByImage.length);
        
        // Separate into neutrals and accents based on saturation
        const neutrals: { color: string; count: number; saturation: number; imageIndex: number }[] = [];
        const accents: { color: string; count: number; saturation: number; imageIndex: number }[] = [];
        
        colorsByImage.forEach(colorData => {
          const rgb = hexToRgb(colorData.color);
          if (!rgb) return;
          
          const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
          
          // Neutrals: low saturation (< 0.3) - increased threshold
          // Accents: high saturation (>= 0.3)
          if (hsl.s < 0.3) {
            neutrals.push({ ...colorData, saturation: hsl.s });
          } else {
            accents.push({ ...colorData, saturation: hsl.s });
          }
        });
        
        console.log('🎨 Neutrals found:', neutrals.length, 'Accents found:', accents.length);
        
        // Sort neutrals by count (most frequent first), then by saturation (lowest first for true neutrals)
        neutrals.sort((a, b) => {
          if (b.count !== a.count) return b.count - a.count;
          return a.saturation - b.saturation;
        });
        
        // Sort accents by count (most frequent first), then by saturation (highest first for vibrant colors)
        accents.sort((a, b) => {
          if (b.count !== a.count) return b.count - a.count;
          return b.saturation - a.saturation;
        });
        
        // Store all extracted neutrals and accents for regeneration
        setExtractedNeutrals(neutrals);
        setExtractedAccents(accents);
        
        // Select colors ensuring representation from all images
        const selectedNeutrals = selectDiverseColorsFromAllImages(neutrals, 3, colorArrays.length);
        const selectedAccents = selectDiverseColorsFromAllImages(accents, 2, colorArrays.length);
        
        console.log('🎨 Selected neutrals:', selectedNeutrals);
        console.log('🎨 Selected accents:', selectedAccents);
        
        // Combine into final palette
        const finalPalette = [
          ...selectedNeutrals,
          ...selectedAccents,
        ];
        
        // Ensure we have 5 colors (fill with defaults if needed)
        while (finalPalette.length < 5) {
          const defaults = ['#E5E5E5', '#C0C0C0', '#808080', '#FF6B6B', '#4ECDC4'];
          finalPalette.push(defaults[finalPalette.length]);
        }
        
        console.log('🎨 Final palette:', finalPalette);
        
        setColorHistories(finalPalette.map(color => ({
          past: [],
          current: color,
          future: [],
        })));
        setExtractedFromVisualLab(true);
        
        // Set debug data for inspection
        setDebugData({
          imageColors: colorArrays.map((colors, index) => ({
            imageIndex: index,
            colors: colors.map(c => c.color),
            imageUrl: imageUrls[index],
          })),
          neutrals: neutrals.map(n => n.color),
          accents: accents.map(a => a.color),
        });
      })
      .catch(error => {
        console.error('Error extracting colors:', error);
        // Fallback to default colors on error
        const defaultColors = [
          '#F5E6D3', '#D4C4B0', '#8B7355', '#C47B84', '#7B9E87',
        ];
        setColorHistories(defaultColors.map(color => ({
          past: [],
          current: color,
          future: [],
        })));
        setExtractedFromVisualLab(true);
      });
  };

  // Extract dominant colors from an image URL
  const extractColorsFromImage = (imageUrl: string, imageIndex: number): Promise<{ color: string; count: number }[]> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      
      img.onload = () => {
        try {
          console.log(`✅ Image ${imageIndex + 1} loaded successfully`);
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Could not get canvas context'));
            return;
          }
          
          // Scale down for faster processing
          const scale = 0.25;
          canvas.width = img.width * scale;
          canvas.height = img.height * scale;
          
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const pixels = imageData.data;
          
          // Color frequency map
          const colorMap = new Map<string, number>();
          
          // Sample every few pixels for performance
          const step = 4;
          for (let i = 0; i < pixels.length; i += step * 4) {
            const r = pixels[i];
            const g = pixels[i + 1];
            const b = pixels[i + 2];
            const a = pixels[i + 3];
            
            // Skip transparent pixels
            if (a < 128) continue;
            
            // Quantize colors to reduce similar shades (round to nearest 16)
            const quantizedR = Math.round(r / 16) * 16;
            const quantizedG = Math.round(g / 16) * 16;
            const quantizedB = Math.round(b / 16) * 16;
            
            const hex = rgbToHex(quantizedR, quantizedG, quantizedB);
            colorMap.set(hex, (colorMap.get(hex) || 0) + 1);
          }
          
          // Convert to array and sort by frequency
          const colorArray = Array.from(colorMap.entries())
            .map(([color, count]) => ({ color, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 40); // Top 40 colors from this image for more variety during regeneration
          
          console.log(`🎨 Image ${imageIndex + 1} extracted ${colorArray.length} colors:`, colorArray.slice(0, 5).map(c => c.color));
          console.log(`   Full palette from Image ${imageIndex + 1}:`, colorArray.map(c => c.color));
          resolve(colorArray);
        } catch (error) {
          console.error(`❌ Error processing image ${imageIndex + 1}:`, error);
          reject(error);
        }
      };
      
      img.onerror = (error) => {
        console.error(`❌ Failed to load image ${imageIndex + 1}:`, imageUrl, error);
        // Resolve with empty array instead of rejecting to allow other images to process
        resolve([]);
      };
      
      img.src = imageUrl;
    });
  };

  // Select diverse colors (avoid very similar colors)
  const selectDiverseColors = (colors: { color: string; count: number }[], count: number): string[] => {
    const selected: string[] = [];
    
    for (const colorData of colors) {
      if (selected.length >= count) break;
      
      // Check if this color is different enough from already selected colors
      const isDiverse = selected.every(selectedColor => {
        return colorDistance(colorData.color, selectedColor) > 30; // Minimum distance threshold
      });
      
      if (isDiverse || selected.length === 0) {
        selected.push(colorData.color);
      }
    }
    
    return selected;
  };

  // Select diverse colors ensuring representation from all images
  const selectDiverseColorsFromAllImages = (colors: { color: string; count: number; imageIndex: number }[], count: number, totalImages: number): string[] => {
    const selected: string[] = []
    const selectedDetails: { color: string; imageIndex: number }[] = [];
    const imageColorCounts: { [key: number]: number } = {};
    
    // Initialize image counts
    for (let i = 0; i < totalImages; i++) {
      imageColorCounts[i] = 0;
    }
    
    console.log('🎨 Selecting diverse colors from all images...');
    console.log('Total colors to select:', count);
    console.log('Total images:', totalImages);
    
    // Try to get at least one color from each image first
    for (let imageIdx = 0; imageIdx < totalImages && selected.length < count; imageIdx++) {
      const colorsFromThisImage = colors.filter(c => c.imageIndex === imageIdx);
      
      for (const colorData of colorsFromThisImage) {
        if (selected.length >= count) break;
        
        // Check if this color is different enough from already selected colors
        const isDiverse = selected.every(selectedColor => {
          return colorDistance(colorData.color, selectedColor) > 30;
        });
        
        if (isDiverse || selected.length === 0) {
          selected.push(colorData.color);
          selectedDetails.push({ color: colorData.color, imageIndex: imageIdx });
          imageColorCounts[imageIdx]++;
          console.log(`  ✓ Selected ${colorData.color} from Image ${imageIdx + 1}`);
          break; // Got one from this image, move to next
        }
      }
    }
    
    // If we still need more colors, get them from any image
    if (selected.length < count) {
      console.log(`Still need ${count - selected.length} more colors, selecting from all images...`);
      
      for (const colorData of colors) {
        if (selected.length >= count) break;
        
        // Check if this color is different enough from already selected colors
        const isDiverse = selected.every(selectedColor => {
          return colorDistance(colorData.color, selectedColor) > 30;
        });
        
        if (isDiverse) {
          selected.push(colorData.color);
          selectedDetails.push({ color: colorData.color, imageIndex: colorData.imageIndex });
          imageColorCounts[colorData.imageIndex]++;
          console.log(`  ✓ Selected ${colorData.color} from Image ${colorData.imageIndex + 1}`);
        }
      }
    }
    
    console.log('🎨 Color distribution by image:', imageColorCounts);
    
    return selected;
  };

  // Calculate perceptual color distance
  const colorDistance = (hex1: string, hex2: string): number => {
    const rgb1 = hexToRgb(hex1);
    const rgb2 = hexToRgb(hex2);
    
    if (!rgb1 || !rgb2) return 0;
    
    // Simple Euclidean distance in RGB space
    const rDiff = rgb1.r - rgb2.r;
    const gDiff = rgb1.g - rgb2.g;
    const bDiff = rgb1.b - rgb2.b;
    
    return Math.sqrt(rDiff * rDiff + gDiff * gDiff + bDiff * bDiff);
  };

  const generateSecondaryPalette = () => {
    // Generate lower saturation variants
    const secondary = mainColors.map(color => {
      if (!color) return '';
      return adjustSaturation(color, -0.3); // Reduce saturation by 30%
    });
    setSecondaryPalette(secondary);
  };

  const generateTertiaryPalette = () => {
    // Generate higher saturation variants
    const tertiary = mainColors.map(color => {
      if (!color) return '';
      return adjustSaturation(color, 0.3); // Increase saturation by 30%
    });
    setTertiaryPalette(tertiary);
  };

  const adjustSaturation = (hex: string, amount: number): string => {
    const rgb = hexToRgb(hex);
    if (!rgb) return hex;

    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    hsl.s = Math.max(0, Math.min(1, hsl.s + amount));
    
    const newRgb = hslToRgb(hsl.h, hsl.s, hsl.l);
    return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
  };

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }

    return { h, s, l };
  };

  const hslToRgb = (h: number, s: number, l: number) => {
    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;

      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255),
    };
  };

  const rgbToHex = (r: number, g: number, b: number): string => {
    // Clamp values to 0-255 range
    const clamp = (val: number) => Math.max(0, Math.min(255, Math.round(val)));
    
    return '#' + [clamp(r), clamp(g), clamp(b)].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  };

  const updateMainColor = (index: number, color: string) => {
    console.log(`🎨 updateMainColor called - Index: ${index}, New Color: ${color}`);
    console.log('Current history before update:', colorHistories[index]);
    
    const newColorHistories = [...colorHistories];
    const currentColor = newColorHistories[index].current;
    
    // Only update if the color actually changed
    if (currentColor === color) {
      console.log('⚠️ Color unchanged, skipping update');
      return;
    }
    
    newColorHistories[index] = {
      past: [...newColorHistories[index].past, currentColor],
      current: color,
      future: [],
    };
    
    console.log('New history after update:', newColorHistories[index]);
    setColorHistories(newColorHistories);
  };

  const undoColorChange = (index: number) => {
    console.log(`⬅️ undoColorChange called - Index: ${index}`);
    console.log('Current history:', colorHistories[index]);
    
    const newColorHistories = [...colorHistories];
    const currentColor = newColorHistories[index].current;
    const pastColors = newColorHistories[index].past;
    
    if (pastColors.length > 0) {
      const previousColor = pastColors[pastColors.length - 1];
      newColorHistories[index] = {
        past: pastColors.slice(0, -1),
        current: previousColor,
        future: [currentColor, ...newColorHistories[index].future],
      };
      
      console.log('Restoring color from:', currentColor, 'to:', previousColor);
      console.log('New history after undo:', newColorHistories[index]);
      setColorHistories(newColorHistories);
    } else {
      console.log('⚠️ No past colors to undo');
    }
  };

  const redoColorChange = (index: number) => {
    console.log(`➡️ redoColorChange called - Index: ${index}`);
    console.log('Current history:', colorHistories[index]);
    
    const newColorHistories = [...colorHistories];
    const currentColor = newColorHistories[index].current;
    const futureColors = newColorHistories[index].future;
    
    if (futureColors.length > 0) {
      const nextColor = futureColors[0];
      newColorHistories[index] = {
        past: [...newColorHistories[index].past, currentColor],
        current: nextColor,
        future: futureColors.slice(1),
      };
      
      console.log('Redoing color from:', currentColor, 'to:', nextColor);
      console.log('New history after redo:', newColorHistories[index]);
      setColorHistories(newColorHistories);
    } else {
      console.log('⚠️ No future colors to redo');
    }
  };

  const addPaletteToCanvas = (colors: string[], paletteType: string) => {
    // Create array of items to add vertically
    const items = colors.filter(c => c).map((color, index) => ({
      type: 'color' as const,
      content: {
        color,
        label: `${paletteType} ${index + 1}`,
      },
    }));
    
    // Add all items vertically stacked to the right of existing items
    onAddItemsVertical(items);
  };

  const addPrimaryPaletteAndContinue = () => {
    // Create array of primary palette items
    const items = mainColors.filter(c => c).map((color, index) => {
      const label = index < 3 ? `Neutral ${index + 1}` : `Accent ${index - 2}`;
      return {
        type: 'color' as const,
        content: {
          color,
          label,
        },
      };
    });
    
    // Add all items vertically stacked to the right of existing items
    onAddItemsVertical(items);
    
    // Then proceed to next step
    onNext();
  };

  const regeneratePalette = () => {
    console.log('🔄 Regenerating palette...');
    console.log('Available neutrals:', extractedNeutrals.length);
    console.log('Available accents:', extractedAccents.length);
    
    if (extractedNeutrals.length === 0 && extractedAccents.length === 0) {
      console.warn('No extracted colors available for regeneration');
      return;
    }
    
    // Shuffle array helper
    const shuffle = <T,>(array: T[]): T[] => {
      const shuffled = [...array];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    };
    
    // Randomly shuffle all available colors for more variety
    const shuffledNeutrals = shuffle(extractedNeutrals);
    const shuffledAccents = shuffle(extractedAccents);
    
    // Select diverse colors from shuffled arrays (lower diversity threshold for more variety)
    const selectDiverseWithLowerThreshold = (colors: { color: string; count: number }[], count: number): string[] => {
      const selected: string[] = [];
      
      for (const colorData of colors) {
        if (selected.length >= count) break;
        
        // Use lower distance threshold (20 instead of 30) for more color variety
        const isDiverse = selected.every(selectedColor => {
          return colorDistance(colorData.color, selectedColor) > 20;
        });
        
        if (isDiverse || selected.length === 0) {
          selected.push(colorData.color);
        }
      }
      
      return selected;
    };
    
    const selectedNeutrals = selectDiverseWithLowerThreshold(shuffledNeutrals, 3);
    const selectedAccents = selectDiverseWithLowerThreshold(shuffledAccents, 2);
    
    // Combine into new palette
    const newPalette = [
      ...selectedNeutrals,
      ...selectedAccents,
    ];
    
    // Ensure we have 5 colors
    while (newPalette.length < 5) {
      const defaults = ['#E5E5E5', '#C0C0C0', '#808080', '#FF6B6B', '#4ECDC4'];
      newPalette.push(defaults[newPalette.length]);
    }
    
    console.log('🎨 Regenerated palette:', newPalette);
    
    // Reset histories with new colors
    setColorHistories(newPalette.map(color => ({
      past: [],
      current: color,
      future: [],
    })));
    setRegenerationCount(regenerationCount + 1);
  };

  const isComplete = mainColors.every(c => c !== '');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Color Lab</h2>
        <p className="text-muted-foreground">
          Auto-extract colors from your Visual Lab image results and build your brand color palette.
          Every good brand should have 3 neutrals and 2 accent colors to balance things out. Drag and drop the ones you like to the canvas and try your way forward.
        </p>
      </div>

      {/* Main Color Palette - 5 colors in one row */}
      <div className="backdrop-blur-xl bg-white/40 border border-white/20 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Primary Palette</h3>
          <div className="flex items-center gap-3">
            <Button
              onClick={extractColorsFromVisualLab}
              variant="outline"
              size="sm"
            >
              {extractedFromVisualLab ? 'Re-extract from Images' : 'Extract from Images'}
            </Button>
            {extractedFromVisualLab && (extractedNeutrals.length > 0 || extractedAccents.length > 0) && (
              <Button
                onClick={regeneratePalette}
                variant="outline"
                size="sm"
              >
                Regenerate Palette
              </Button>
            )}
            {isComplete && (
              <Button
                onClick={() => addPaletteToCanvas(mainColors, 'Primary')}
                variant="outline"
                size="sm"
              >
                Add All to Canvas
              </Button>
            )}
            
          </div>
        </div>

        <div className="flex gap-3">
          {mainColors.map((color, index) => {
            const history = colorHistories[index];

            return (
              <DraggableColorChip
                key={`${index}-${history.current}`}
                color={history.current || '#f0f0f0'}
                label={index < 3 ? `Neutral ${index + 1}` : `Accent ${index - 2}`}
                onAddItem={onAddItem}
                showControls={true}
                history={history}
                onUndo={() => undoColorChange(index)}
                onRedo={() => redoColorChange(index)}
                onColorChange={(newColor) => updateMainColor(index, newColor)}
              />
            );
          })}
        </div>
      </div>

      {/* Secondary Palette - Lower Saturation */}
      {isComplete && (
        <div className="backdrop-blur-xl bg-white/40 border border-white/20 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">Secondary Palette</h3>
              <p className="text-xs text-muted-foreground mt-1">Lower saturation variants - Softer, muted tones</p>
            </div>
            <Button
              onClick={() => addPaletteToCanvas(secondaryPalette, 'Secondary')}
              size="sm"
              variant="outline"
            >
              Add All to Canvas
            </Button>
          </div>

          <div className="flex gap-3">
            {secondaryPalette.map((color, index) => (
              <DraggableColorChip
                key={index}
                color={color}
                label={`Secondary ${index + 1}`}
                onAddItem={onAddItem}
              />
            ))}
          </div>
        </div>
      )}

      {/* Tertiary Palette - Higher Saturation */}
      {isComplete && (
        <div className="backdrop-blur-xl bg-white/40 border border-white/20 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">Tertiary Palette</h3>
              <p className="text-xs text-muted-foreground mt-1">Higher saturation variants - Vibrant, bold tones</p>
            </div>
            <Button
              onClick={() => addPaletteToCanvas(tertiaryPalette, 'Tertiary')}
              size="sm"
              variant="outline"
            >
              Add All to Canvas
            </Button>
          </div>

          <div className="flex gap-3">
            {tertiaryPalette.map((color, index) => (
              <DraggableColorChip
                key={index}
                color={color}
                label={`Tertiary ${index + 1}`}
                onAddItem={onAddItem}
              />
            ))}
          </div>
        </div>
      )}

      {/* Color Source Panel - Show Extracted Colors */}
      {debugData && (
        <div className="backdrop-blur-xl bg-white/40 border border-white/20 rounded-2xl p-6 shadow-lg">
          <div className="mb-6">
            <h3 className="font-semibold mb-1">Color Source Breakdown</h3>
            <p className="text-xs text-muted-foreground">
              View the complete color palette extracted from your Visual Lab images and sample from them manually using the eydropper tool.
            </p>
          </div>
          
          {/* Colors from each image */}
          <div className="space-y-6 mb-6">
            
            {debugData.imageColors.map((imgData) => (
              <div key={imgData.imageIndex} className="space-y-3">
                <div className="flex items-center gap-3">
                  <img 
                    src={imgData.imageUrl} 
                    alt={`Visual Lab ${imgData.imageIndex + 1}`}
                    className="w-24 h-24 object-cover rounded-lg border border-[#131718] shadow-sm"
                  />
                  <div>
                    <p className="text-sm font-medium">Visual Lab Image {imgData.imageIndex + 1}</p>
                    <p className="text-xs text-muted-foreground">{imgData.colors.length} colors extracted</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {imgData.colors.map((color, idx) => (
                    <div
                      key={idx}
                      className="w-10 h-10 rounded-lg border border-[#131718]/40 shadow-sm transition-transform hover:scale-110"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Neutrals vs Accents */}
          
        </div>
      )}

      {/* Continue Button - Shows after Color Source Breakdown */}
      {debugData && (
        <div className="flex justify-end pt-6 mt-6 border-t border-[#131718]">
          <Button
            onClick={onNext}
            size="lg"
            disabled={!isComplete}
          >
            Continue
          </Button>
        </div>
      )}
    </div>
  );
}