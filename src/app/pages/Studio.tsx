import { useState, useEffect, useCallback, useRef } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Canvas } from '@/app/components/studio/Canvas';
import { StudioDrawer } from '@/app/components/studio/StudioDrawer';
import { StudioHeader } from '@/app/components/studio/StudioHeader';
import { SEO } from '@/app/components/SEO';
import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';
import gsap from 'gsap';

export interface CanvasItem {
  id: string;
  type: 'card' | 'image' | 'text' | 'color' | 'gradient' | 'typography' | 'link';
  content: any;
  position: { x: number; y: number };
}

export interface JourneyData {
  [stepKey: string]: any;
}

export default function Studio() {
  const [canvasItems, setCanvasItems] = useState<CanvasItem[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [highestUnlockedStep, setHighestUnlockedStep] = useState(1);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [devMode, setDevMode] = useState(false);
  const [journeyData, setJourneyData] = useState<JourneyData>({});
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Smooth fade-in transition when coming from intro
  useEffect(() => {
    const isTransitioning = sessionStorage.getItem('intro-transitioning');
    
    if (isTransitioning === 'true' && containerRef.current) {
      // Remove the flag
      sessionStorage.removeItem('intro-transitioning');
      
      // Start from blurred and transparent
      gsap.set(containerRef.current, {
        opacity: 0,
        filter: 'blur(30px)',
        scale: 0.95
      });
      
      // Fade in smoothly
      gsap.to(containerRef.current, {
        opacity: 1,
        filter: 'blur(0px)',
        scale: 1,
        duration: 1.2,
        ease: 'power1.out',
        delay: 0.2 // Small delay for smooth blend
      });
    }
  }, []);

  // Load highest unlocked step and journey data from sessionStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('highestUnlockedStep');
      if (stored) {
        const step = parseInt(stored, 10);
        setHighestUnlockedStep(step);
      }
      
      // Load journey data
      const journeyStored = sessionStorage.getItem('journeyData');
      if (journeyStored) {
        try {
          setJourneyData(JSON.parse(journeyStored));
        } catch (e) {
          console.error('Failed to parse journey data:', e);
        }
      }

      // Load canvas items
      const canvasStored = sessionStorage.getItem('canvasItems');
      if (canvasStored) {
        try {
          setCanvasItems(JSON.parse(canvasStored));
        } catch (e) {
          console.error('Failed to parse canvas items:', e);
        }
      }
      
      // Check for dev mode
      const devModeStored = sessionStorage.getItem('devMode');
      if (devModeStored === 'true') {
        setDevMode(true);
      }
    }
  }, []);

  // Save highest unlocked step to sessionStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('highestUnlockedStep', highestUnlockedStep.toString());
    }
  }, [highestUnlockedStep]);

  // Save journey data to sessionStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        // Create a serializable version of journeyData by removing React components and circular refs
        const serializableJourneyData = JSON.parse(JSON.stringify(journeyData, (key, value) => {
          // Skip React components and functions
          if (typeof value === 'function' || (value && value.$$typeof)) {
            return undefined;
          }
          return value;
        }));
        sessionStorage.setItem('journeyData', JSON.stringify(serializableJourneyData));
      } catch (error) {
        console.error('Failed to save journey data:', error);
      }
    }
  }, [journeyData]);

  // Save canvas items to sessionStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        // Create a serializable version of canvasItems by removing React components and circular refs
        const serializableCanvasItems = JSON.parse(JSON.stringify(canvasItems, (key, value) => {
          // Skip React components and functions
          if (typeof value === 'function' || (value && value.$$typeof)) {
            return undefined;
          }
          return value;
        }));
        sessionStorage.setItem('canvasItems', JSON.stringify(serializableCanvasItems));
      } catch (error) {
        console.error('Failed to save canvas items:', error);
      }
    }
  }, [canvasItems]);

  // Save dev mode to sessionStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('devMode', devMode.toString());
    }
  }, [devMode]);

  const toggleDevMode = () => {
    const newDevMode = !devMode;
    setDevMode(newDevMode);
    if (newDevMode) {
      setHighestUnlockedStep(10); // Unlock all 10 steps
    } else {
      setHighestUnlockedStep(1); // Reset to step 1
    }
  };

  const handleStepChange = (step: number) => {
    // Only allow navigation to unlocked steps
    if (step <= highestUnlockedStep) {
      setCurrentStep(step);
    }
  };

  const handleStepComplete = () => {
    // When user completes current step, unlock the next one
    const nextStep = currentStep + 1;
    if (nextStep > highestUnlockedStep) {
      setHighestUnlockedStep(nextStep);
    }
    setCurrentStep(nextStep);
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.1, 2)); // Max 200%
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.1, 0.5)); // Min 50%
  };

  const handleZoomReset = () => {
    setZoom(1);
  };

  // Helper function to calculate the rightmost X position of existing canvas items
  const getRightmostPosition = (): { x: number; y: number } => {
    if (canvasItems.length === 0) {
      return { x: 100, y: 100 }; // Default starting position
    }

    // Find the rightmost item
    const rightmostItem = canvasItems.reduce((rightmost, item) => {
      return item.position.x > rightmost.position.x ? item : rightmost;
    }, canvasItems[0]);

    // Calculate width based on item type
    const rightmostItemWidth = rightmostItem.type === 'typography' ? 350 : 240;
    const GAP = 40;
    
    return {
      x: rightmostItem.position.x + rightmostItemWidth + GAP,
      y: 100, // Start at top for vertical stacking
    };
  };

  const addItemToCanvas = (item: Omit<CanvasItem, 'id' | 'position'>, position?: { x: number; y: number }) => {
    const newItem: CanvasItem = {
      ...item,
      id: crypto.randomUUID(),
      position: position || getRightmostPosition(), // Use provided position or calculate rightmost
    };
    setCanvasItems(items => [...items, newItem]);
  };

  // New function to add multiple items vertically stacked to the right of existing items
  const addItemsToCanvasVertical = (items: Omit<CanvasItem, 'id' | 'position'>[]) => {
    const startPos = getRightmostPosition();
    
    // Reduced vertical gaps to 50% of previous
    const getSpacing = (item: Omit<CanvasItem, 'id' | 'position'>) => {
      if (item.type === 'typography') {
        return 320; // Typography card height (increased from 285 to prevent overlap)
      } else if (item.type === 'color' || item.type === 'gradient') {
        return 175; // Color/gradient card height (~160px) + 15px gap
      } else if (item.type === 'card' && (item.content.visualExample || item.content.svgPattern)) {
        // Design Elements cards have visual examples or SVG patterns
        return 240; // Custom spacing for Design Elements cards
      }
      return 220; // Default spacing for other types
    };

    const newItems: CanvasItem[] = [];
    let currentY = startPos.y;

    items.forEach((item, index) => {
      newItems.push({
        ...item,
        id: crypto.randomUUID(),
        position: {
          x: startPos.x,
          y: currentY,
        },
      });
      
      // Add spacing for next item (except for last item)
      if (index < items.length - 1) {
        currentY += getSpacing(item);
      }
    });

    setCanvasItems(prevItems => [...prevItems, ...newItems]);
  };

  // New function to add multiple items horizontally positioned to the right of existing items
  const addItemsToCanvasHorizontal = (items: Omit<CanvasItem, 'id' | 'position'>[]) => {
    const startPos = getRightmostPosition();
    const HORIZONTAL_SPACING = 280; // Space between horizontally placed items (image width ~250px + 30px gap)

    const newItems: CanvasItem[] = items.map((item, index) => ({
      ...item,
      id: crypto.randomUUID(),
      position: {
        x: startPos.x + (index * HORIZONTAL_SPACING),
        y: startPos.y,
      },
    }));

    setCanvasItems(prevItems => [...prevItems, ...newItems]);
  };

  const updateItemPosition = (id: string, position: { x: number; y: number }) => {
    // If the item being dragged is in the selection, move all selected items
    if (selectedItems.includes(id) && selectedItems.length > 1) {
      const draggedItem = canvasItems.find(item => item.id === id);
      if (!draggedItem) return;
      
      // Calculate offset from original position
      const offsetX = position.x - draggedItem.position.x;
      const offsetY = position.y - draggedItem.position.y;
      
      // Move all selected items by the same offset
      setCanvasItems(items =>
        items.map(item =>
          selectedItems.includes(item.id)
            ? { ...item, position: { x: item.position.x + offsetX, y: item.position.y + offsetY } }
            : item
        )
      );
    } else {
      // Single item drag
      setCanvasItems(items =>
        items.map(item =>
          item.id === id ? { ...item, position } : item
        )
      );
    }
  };

  const updateItemContent = (id: string, content: any) => {
    setCanvasItems(items =>
      items.map(item =>
        item.id === id ? { ...item, content } : item
      )
    );
  };

  const removeItemFromCanvas = (id: string) => {
    setCanvasItems(items => items.filter(item => item.id !== id));
  };

  const duplicateItem = (id: string) => {
    const item = canvasItems.find(item => item.id === id);
    if (!item) return;

    // Create a duplicate with a new ID and offset position
    const newItem: CanvasItem = {
      ...item,
      id: crypto.randomUUID(),
      position: {
        x: item.position.x + 30,
        y: item.position.y + 30,
      },
    };
    setCanvasItems(items => [...items, newItem]);
  };

  // Clear canvas only
  const handleClearCanvas = () => {
    setCanvasItems([]);
  };

  // Clear canvas and reset journey progress
  const handleClearAll = () => {
    setCanvasItems([]);
    setJourneyData({});
    setCurrentStep(1);
    setHighestUnlockedStep(1);
    sessionStorage.removeItem('creator-branding-highest-step');
    sessionStorage.removeItem('creator-branding-journey-data');
  };

  const updateJourneyData = (stepKey: string, data: any) => {
    setJourneyData(prev => ({
      ...prev,
      [stepKey]: data,
    }));
  };

  // Download progress as JSON
  const handleDownloadProgress = () => {
    const progressData = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      canvasItems,
      currentStep,
      highestUnlockedStep,
      journeyData,
      devMode,
    };

    const dataStr = JSON.stringify(progressData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `creator-branding-studio-progress-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Upload progress from JSON
  const handleUploadProgress = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const progressData = JSON.parse(event.target?.result as string);
          
          // Validate the data structure
          if (progressData.canvasItems) setCanvasItems(progressData.canvasItems);
          if (progressData.currentStep) setCurrentStep(progressData.currentStep);
          if (progressData.highestUnlockedStep) setHighestUnlockedStep(progressData.highestUnlockedStep);
          if (progressData.journeyData) setJourneyData(progressData.journeyData);
          if (typeof progressData.devMode === 'boolean') setDevMode(progressData.devMode);

          console.log('✅ Progress loaded successfully!');
        } catch (error) {
          console.error('❌ Failed to load progress:', error);
          alert('Failed to load progress file. Please ensure it\'s a valid JSON file.');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  // Export canvas as PDF
  const handleExportPDF = async () => {
    if (canvasItems.length === 0) {
      alert('Canvas is empty. Add some items before exporting.');
      return;
    }

    try {
      // Calculate bounding box of all items with padding
      const padding = 50;
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

      canvasItems.forEach(item => {
        minX = Math.min(minX, item.position.x);
        minY = Math.min(minY, item.position.y);
        const itemWidth = item.type === 'typography' ? 350 : 240;
        const itemHeight = item.type === 'typography' ? 280 : ((item.type === 'color' || item.type === 'gradient') ? 160 : 200);
        maxX = Math.max(maxX, item.position.x + itemWidth);
        maxY = Math.max(maxY, item.position.y + itemHeight);
      });

      // Add padding
      minX = Math.max(0, minX - padding);
      minY = Math.max(0, minY - padding);
      maxX = maxX + padding;
      maxY = maxY + padding;

      const width = maxX - minX;
      const height = maxY - minY;

      // Create a temporary container for the export
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.width = `${width}px`;
      tempContainer.style.height = `${height}px`;
      tempContainer.style.backgroundColor = '#FAFAF9';
      
      // Add dotted grid background
      tempContainer.style.backgroundImage = `
        radial-gradient(circle, rgba(19, 23, 24, 0.35) 1px, transparent 1px)
      `;
      tempContainer.style.backgroundSize = '24px 24px';
      tempContainer.style.backgroundPosition = '0 0';

      document.body.appendChild(tempContainer);

      // Clone all canvas items into the temp container with adjusted positions
      canvasItems.forEach(item => {
        const itemElement = document.querySelector(`[data-canvas-item-id="${item.id}"]`) as HTMLElement;
        if (itemElement) {
          const clone = itemElement.cloneNode(true) as HTMLElement;
          // Adjust position relative to bounding box
          clone.style.position = 'absolute';
          clone.style.left = `${item.position.x - minX}px`;
          clone.style.top = `${item.position.y - minY}px`;
          
          // Remove interactive elements from clone
          const removeButtons = clone.querySelectorAll('button');
          removeButtons.forEach(btn => btn.remove());
          
          // Remove group hover effects
          clone.classList.remove('group');
          
          // Ensure opacity is full
          clone.style.opacity = '1';
          
          // Convert outline to border for html2canvas compatibility
          const cardDiv = clone.querySelector('div.rounded-lg') as HTMLElement;
          if (cardDiv) {
            const computedStyle = window.getComputedStyle(itemElement.querySelector('div.rounded-lg') as HTMLElement);
            if (computedStyle.outlineWidth && computedStyle.outlineWidth !== '0px') {
              cardDiv.style.outline = 'none';
              cardDiv.style.border = `${computedStyle.outlineWidth} ${computedStyle.outlineStyle} ${computedStyle.outlineColor}`;
            }
          }
          
          tempContainer.appendChild(clone);
        }
      });

      // Capture the temp container with html2canvas
      const canvas = await html2canvas(tempContainer, {
        backgroundColor: '#FAFAF9',
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
      });

      // Remove the temp container
      document.body.removeChild(tempContainer);

      // Create a final canvas with footer
      const finalCanvas = document.createElement('canvas');
      const finalCtx = finalCanvas.getContext('2d');
      
      if (!finalCtx) {
        alert('Failed to create canvas context');
        return;
      }

      // Set canvas size (original + footer space)
      const footerHeight = 80;
      finalCanvas.width = canvas.width;
      finalCanvas.height = canvas.height + footerHeight * 2; // Scale for retina

      // Draw the screenshot
      finalCtx.drawImage(canvas, 0, 0);

      // Draw full-width footer background in light pink
      finalCtx.fillStyle = '#FEE6EA';
      finalCtx.fillRect(0, canvas.height, finalCanvas.width, footerHeight * 2);

      // Draw footer text
      finalCtx.fillStyle = '#131718';
      finalCtx.font = '32px "Work Sans", sans-serif'; // 2x for retina
      finalCtx.textAlign = 'left';
      finalCtx.textBaseline = 'middle';
      
      const text = 'Brief created with ';
      const boldText = 'creator-branding.com';
      const text2 = ' built with 💜 by ';
      const boldText2 = '@stellaachenbach';
      
      let x = 80;
      const y = canvas.height + (footerHeight);
      
      finalCtx.fillText(text, x, y);
      x += finalCtx.measureText(text).width;
      
      finalCtx.font = 'bold 32px "Work Sans", sans-serif';
      finalCtx.fillText(boldText, x, y);
      x += finalCtx.measureText(boldText).width;
      
      finalCtx.font = '32px "Work Sans", sans-serif';
      finalCtx.fillText(text2, x, y);
      x += finalCtx.measureText(text2).width;
      
      finalCtx.font = 'bold 32px "Work Sans", sans-serif';
      finalCtx.fillText(boldText2, x, y);

      // Create PDF
      const finalDataUrl = finalCanvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: finalCanvas.width > finalCanvas.height ? 'landscape' : 'portrait',
        unit: 'px',
        format: [finalCanvas.width, finalCanvas.height],
      });

      pdf.addImage(finalDataUrl, 'PNG', 0, 0, finalCanvas.width, finalCanvas.height);
      pdf.save(`creator-branding-studio-export-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Error exporting canvas:', error);
      alert('Failed to export canvas. Please try again.');
    }
  };

  // Export canvas as PNG
  const handleExportPNG = async () => {
    if (canvasItems.length === 0) {
      alert('Canvas is empty. Add some items before exporting.');
      return;
    }

    try {
      // Calculate bounding box of all items with padding
      const padding = 50;
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

      canvasItems.forEach(item => {
        minX = Math.min(minX, item.position.x);
        minY = Math.min(minY, item.position.y);
        const itemWidth = item.type === 'typography' ? 350 : 240;
        const itemHeight = item.type === 'typography' ? 280 : ((item.type === 'color' || item.type === 'gradient') ? 160 : 200);
        maxX = Math.max(maxX, item.position.x + itemWidth);
        maxY = Math.max(maxY, item.position.y + itemHeight);
      });

      // Add padding
      minX = Math.max(0, minX - padding);
      minY = Math.max(0, minY - padding);
      maxX = maxX + padding;
      maxY = maxY + padding;

      const width = maxX - minX;
      const height = maxY - minY;

      // Create a temporary container for the export
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.width = `${width}px`;
      tempContainer.style.height = `${height}px`;
      tempContainer.style.backgroundColor = '#FAFAF9';
      
      // Add dotted grid background
      tempContainer.style.backgroundImage = `
        radial-gradient(circle, rgba(19, 23, 24, 0.35) 1px, transparent 1px)
      `;
      tempContainer.style.backgroundSize = '24px 24px';
      tempContainer.style.backgroundPosition = '0 0';

      document.body.appendChild(tempContainer);

      // Clone all canvas items into the temp container with adjusted positions
      canvasItems.forEach(item => {
        const itemElement = document.querySelector(`[data-canvas-item-id="${item.id}"]`) as HTMLElement;
        if (itemElement) {
          const clone = itemElement.cloneNode(true) as HTMLElement;
          // Adjust position relative to bounding box
          clone.style.position = 'absolute';
          clone.style.left = `${item.position.x - minX}px`;
          clone.style.top = `${item.position.y - minY}px`;
          
          // Remove interactive elements from clone
          const removeButtons = clone.querySelectorAll('button');
          removeButtons.forEach(btn => btn.remove());
          
          // Remove group hover effects
          clone.classList.remove('group');
          
          // Ensure opacity is full
          clone.style.opacity = '1';
          
          // Convert outline to border for html2canvas compatibility
          const cardDiv = clone.querySelector('div.rounded-lg') as HTMLElement;
          if (cardDiv) {
            const computedStyle = window.getComputedStyle(itemElement.querySelector('div.rounded-lg') as HTMLElement);
            if (computedStyle.outlineWidth && computedStyle.outlineWidth !== '0px') {
              cardDiv.style.outline = 'none';
              cardDiv.style.border = `${computedStyle.outlineWidth} ${computedStyle.outlineStyle} ${computedStyle.outlineColor}`;
            }
          }
          
          tempContainer.appendChild(clone);
        }
      });

      // Capture the temp container with html2canvas
      const canvas = await html2canvas(tempContainer, {
        backgroundColor: '#FAFAF9',
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
      });

      // Remove the temp container
      document.body.removeChild(tempContainer);

      // Create a final canvas with footer
      const finalCanvas = document.createElement('canvas');
      const finalCtx = finalCanvas.getContext('2d');
      
      if (!finalCtx) {
        alert('Failed to create canvas context');
        return;
      }

      // Set canvas size (original + footer space)
      const footerHeight = 80;
      finalCanvas.width = canvas.width;
      finalCanvas.height = canvas.height + footerHeight * 2; // Scale for retina

      // Draw the screenshot
      finalCtx.drawImage(canvas, 0, 0);

      // Draw full-width footer background in light pink
      finalCtx.fillStyle = '#FEE6EA';
      finalCtx.fillRect(0, canvas.height, finalCanvas.width, footerHeight * 2);

      // Draw footer text
      finalCtx.fillStyle = '#131718';
      finalCtx.font = '32px "Work Sans", sans-serif'; // 2x for retina
      finalCtx.textAlign = 'left';
      finalCtx.textBaseline = 'middle';
      
      const text = 'Brief created with ';
      const boldText = 'creator-branding.com';
      const text2 = ' built with 💜 by ';
      const boldText2 = '@stellaachenbach';
      
      let x = 80;
      const y = canvas.height + (footerHeight);
      
      finalCtx.fillText(text, x, y);
      x += finalCtx.measureText(text).width;
      
      finalCtx.font = 'bold 32px "Work Sans", sans-serif';
      finalCtx.fillText(boldText, x, y);
      x += finalCtx.measureText(boldText).width;
      
      finalCtx.font = '32px "Work Sans", sans-serif';
      finalCtx.fillText(text2, x, y);
      x += finalCtx.measureText(text2).width;
      
      finalCtx.font = 'bold 32px "Work Sans", sans-serif';
      finalCtx.fillText(boldText2, x, y);

      // Download
      finalCanvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.download = `creator-branding-canvas-export-${new Date().toISOString().split('T')[0]}.png`;
          link.href = url;
          link.click();
          URL.revokeObjectURL(url);
        }
      });
    } catch (error) {
      console.error('Error exporting canvas:', error);
      alert('Failed to export canvas. Please try again.');
    }
  };

  const handleItemSelect = (id: string, isMultiSelect: boolean) => {
    if (isMultiSelect) {
      // Toggle selection with Cmd/Ctrl
      setSelectedItems(prev =>
        prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
      );
    } else {
      // Single select (deselect others)
      setSelectedItems([id]);
    }
  };

  const handleDeselectAll = () => {
    setSelectedItems([]);
  };

  const handleSelectAll = () => {
    setSelectedItems(canvasItems.map(item => item.id));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <SEO 
        title="Studio - Creator Branding Studio"
        description="Build your personal brand visually on an interactive canvas. Drag and drop your branding elements to create a comprehensive brand brief."
        keywords="brand studio, visual branding, brand canvas, personal brand builder, interactive branding tool, brand brief creator"
      />
      <div className="min-h-screen bg-background text-foreground flex flex-col overflow-hidden" ref={containerRef}>
        <StudioHeader />
        
        <Canvas
          items={canvasItems}
          selectedItems={selectedItems}
          onUpdatePosition={updateItemPosition}
          onUpdateContent={updateItemContent}
          onRemoveItem={removeItemFromCanvas}
          onDuplicateItem={duplicateItem}
          onAddItem={addItemToCanvas}
          onItemSelect={handleItemSelect}
          onDeselectAll={handleDeselectAll}
          onSelectAll={handleSelectAll}
          zoom={zoom}
          onDownloadProgress={handleDownloadProgress}
          onUploadProgress={handleUploadProgress}
          onExportPNG={handleExportPNG}
          onExportPDF={handleExportPDF}
          onClearCanvas={handleClearCanvas}
          onClearAll={handleClearAll}
        />

        <StudioDrawer
          isOpen={isDrawerOpen}
          onToggle={() => setIsDrawerOpen(!isDrawerOpen)}
          currentStep={currentStep}
          highestUnlockedStep={highestUnlockedStep}
          onStepChange={handleStepChange}
          onAddItem={addItemToCanvas}
          onAddItemsVertical={addItemsToCanvasVertical}
          onAddItemsHorizontal={addItemsToCanvasHorizontal}
          onStepComplete={handleStepComplete}
          onToggleDevMode={toggleDevMode}
          devMode={devMode}
          journeyData={journeyData}
          onUpdateJourneyData={updateJourneyData}
          onDownloadProgress={handleDownloadProgress}
        />

        {/* SVG Filter for Liquid Glass Effect */}
        <svg style={{ display: 'none' }}>
          <filter
            id="glass-distortion"
            x="0%"
            y="0%"
            width="100%"
            height="100%"
            filterUnits="objectBoundingBox"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.01 0.01"
              numOctaves="1"
              seed="5"
              result="turbulence"
            />

            <feComponentTransfer in="turbulence" result="mapped">
              <feFuncR type="gamma" amplitude="1" exponent="10" offset="0.5" />
              <feFuncG type="gamma" amplitude="0" exponent="1" offset="0" />
              <feFuncB type="gamma" amplitude="0" exponent="1" offset="0.5" />
            </feComponentTransfer>

            <feGaussianBlur in="turbulence" stdDeviation="3" result="softMap" />

            <feSpecularLighting
              in="softMap"
              surfaceScale="5"
              specularConstant="1"
              specularExponent="100"
              lightingColor="white"
              result="specLight"
            >
              <fePointLight x="-200" y="-200" z="300" />
            </feSpecularLighting>

            <feComposite
              in="specLight"
              operator="arithmetic"
              k1="0"
              k2="1"
              k3="1"
              k4="0"
              result="litImage"
            />

            <feDisplacementMap
              in="SourceGraphic"
              in2="softMap"
              scale="150"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </svg>
      </div>
    </DndProvider>
  );
}