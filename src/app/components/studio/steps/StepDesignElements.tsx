import { Button } from '@/app/components/ui/button';
import type { CanvasItem, JourneyData } from '@/app/pages/Studio';
import { useDrag } from 'react-dnd';
import { useState, useEffect } from 'react';
import { Plus, GripVertical, Trash2 } from 'lucide-react';

interface StepDesignElementsProps {
  onAddItem: (item: Omit<CanvasItem, 'id' | 'position'>) => void;
  onAddItemsVertical: (items: Omit<CanvasItem, 'id' | 'position'>[]) => void;
  onNext: () => void;
  journeyData: JourneyData;
  onUpdateJourneyData: (stepKey: string, data: any) => void;
}

interface DesignPrinciple {
  id: string;
  text: string;
  timestamp: number;
}

const DraggablePrincipleCard = ({ 
  principle,
  onDelete,
}: { 
  principle: DesignPrinciple;
  onDelete: () => void;
}) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'CARD',
    item: {
      isNew: true,
      title: 'Design Principle',
      description: principle.text,
      tags: ['Design Principle'],
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [principle]);

  return (
    <div
      ref={drag}
      className="group relative bg-card/40 backdrop-blur-2xl border border-border rounded-lg p-4 hover:border-[#131718] hover:bg-[#FEE6EA]/10 transition-all cursor-grab active:cursor-grabbing"
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <div className="flex items-start gap-3">
        <GripVertical className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
        <p className="flex-1 text-sm text-foreground leading-relaxed">{principle.text}</p>
        <button
          onClick={onDelete}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg pointer-events-none">
        <span className="text-white text-xs font-medium">Drag to Canvas</span>
      </div>
    </div>
  );
};

export function StepDesignElements({ onAddItem, onAddItemsVertical, onNext, journeyData, onUpdateJourneyData }: StepDesignElementsProps) {
  const [principles, setPrinciples] = useState<DesignPrinciple[]>([]);
  const [newPrinciple, setNewPrinciple] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);

  // Load saved principles on mount
  useEffect(() => {
    if (journeyData.designElements && !isInitialized) {
      setPrinciples(journeyData.designElements.principles || []);
      setIsInitialized(true);
    }
  }, []);

  // Save principles whenever they change
  useEffect(() => {
    if (isInitialized) {
      onUpdateJourneyData('designElements', { principles });
    }
  }, [principles, isInitialized]);

  const handleAddPrinciple = () => {
    if (!newPrinciple.trim()) return;

    const principle: DesignPrinciple = {
      id: `principle-${Date.now()}`,
      text: newPrinciple.trim(),
      timestamp: Date.now(),
    };

    setPrinciples(prev => [...prev, principle]);
    setNewPrinciple('');

    // Optionally auto-add to canvas
    onAddItem({
      type: 'card',
      content: {
        title: 'Design Principle',
        description: principle.text,
        tags: ['Design Principle'],
      },
    });
  };

  const handleDeletePrinciple = (id: string) => {
    setPrinciples(prev => prev.filter(p => p.id !== id));
  };

  const handleContinue = () => {
    // Add all principles to canvas as a vertical stack
    if (principles.length > 0) {
      onAddItemsVertical(
        principles.map(p => ({
          type: 'card',
          content: {
            title: 'Design Principle',
            description: p.text,
            tags: ['Design Principle'],
          },
        }))
      );
    }
    onNext();
  };

  const examplePrompts = [
    "Use generous white space - designs should breathe, never feel cramped",
    "Bold typography as the hero - minimal decoration, let words speak",
    "Photography should feel candid and human, not staged or sterile",
    "Rounded corners throughout for approachability and warmth",
    "Asymmetric layouts that feel dynamic, not predictable grids",
    "Every element must earn its place - ruthless simplicity",
    "Vibrant color as accents only - restrained but impactful",
    "Embrace negative space as a design element, not empty space",
  ];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Design Principles</h2>
        <p className="text-muted-foreground">
          Define 3-5 guiding principles that will shape how your brand looks and feels. These principles help designers understand your visual philosophy and make decisions that align with your brand.
        </p>
      </div>

      {/* Add Principle Input */}
      <div className="mb-6">
        <div className="bg-[#FEE6EA]/20 border border-[#131718]/10 rounded-lg p-4">
          <label className="block text-sm font-medium mb-2">Add a Design Principle</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newPrinciple}
              onChange={(e) => setNewPrinciple(e.target.value)}
              onKeyDown={(e) => {
                // Allow Cmd+A / Ctrl+A for select all - don't interfere with it
                if ((e.metaKey || e.ctrlKey) && (e.key.toLowerCase() === 'a')) {
                  // Let the browser handle it
                  return;
                }
                if (e.key === 'Enter') {
                  handleAddPrinciple();
                }
              }}
              placeholder="e.g., Use generous white space - designs should breathe, never feel cramped"
              className="flex-1 px-4 py-2.5 bg-card/80 backdrop-blur-2xl border border-border rounded-lg text-sm focus:outline-none focus:border-[#131718] transition-colors"
            />
            <button
              onClick={handleAddPrinciple}
              disabled={!newPrinciple.trim()}
              className="px-4 py-2.5 bg-[#131718] text-white rounded-lg text-sm font-medium hover:bg-[#131718]/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </div>
        </div>
      </div>

      {/* Example Prompts */}
      {principles.length === 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Example Principles for Inspiration
          </h3>
          <div className="grid grid-cols-1 gap-2">
            {examplePrompts.map((prompt, index) => (
              <button
                key={index}
                onClick={() => setNewPrinciple(prompt)}
                className="text-left px-4 py-3 bg-card/20 backdrop-blur-2xl border border-border/50 rounded-lg text-sm text-muted-foreground hover:border-[#131718] hover:bg-[#FEE6EA]/10 hover:text-foreground transition-all"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Saved Principles */}
      {principles.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Your Design Principles ({principles.length})
          </h3>
          <div className="space-y-2">
            {principles.map((principle) => (
              <DraggablePrincipleCard
                key={principle.id}
                principle={principle}
                onDelete={() => handleDeletePrinciple(principle.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="mb-6 bg-card/20 backdrop-blur-2xl border border-border/50 rounded-lg p-4">
        <h4 className="text-sm font-semibold mb-2">Tips for Writing Effective Principles</h4>
        <ul className="text-sm text-muted-foreground space-y-1.5">
          <li>• Be specific - "rounded corners for warmth" not just "friendly"</li>
          <li>• Explain the why - helps designers make aligned decisions</li>
          <li>• Focus on constraints - what to avoid is as valuable as what to embrace</li>
          <li>• Think holistically - consider layout, spacing, photography, graphic style</li>
          <li>• Aim for 3-5 principles - enough to guide, not overwhelm</li>
        </ul>
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-[#131718]">
        <p className="text-sm text-muted-foreground">
          {principles.length} principle{principles.length !== 1 ? 's' : ''} defined
        </p>
        <Button onClick={handleContinue}>
          Continue →
        </Button>
      </div>
    </div>
  );
}