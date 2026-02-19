import { Button } from '@/app/components/ui/button';
import { Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { CanvasItem, JourneyData } from '@/app/pages/Studio';

interface StepAdjectivesProps {
  onAddItem: (item: Omit<CanvasItem, 'id' | 'position'>) => void;
  onNext: () => void;
  journeyData: JourneyData;
  onUpdateJourneyData: (stepKey: string, data: any) => void;
}

const adjectiveCategories = [
  {
    category: 'Visual Energy',
    adjectives: ['Bold', 'Minimal', 'Playful', 'Elegant', 'Edgy', 'Warm', 'Clean', 'Vibrant'],
  },
  {
    category: 'Tone & Feel',
    adjectives: ['Sophisticated', 'Approachable', 'Quirky', 'Professional', 'Authentic', 'Luxe', 'Grounded', 'Dreamy'],
  },
  {
    category: 'Personality',
    adjectives: ['Innovative', 'Trustworthy', 'Rebellious', 'Nurturing', 'Witty', 'Confident', 'Thoughtful', 'Dynamic'],
  },
];

export function StepAdjectives({ onAddItem, onNext, journeyData, onUpdateJourneyData }: StepAdjectivesProps) {
  const [selectedAdjectives, setSelectedAdjectives] = useState<string[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load saved data only on mount
  useEffect(() => {
    if (journeyData.adjectives && !isInitialized) {
      setSelectedAdjectives(journeyData.adjectives);
      setIsInitialized(true);
    }
  }, []);

  // Save selections whenever they change (but not on initial load)
  useEffect(() => {
    if (isInitialized && selectedAdjectives.length > 0) {
      onUpdateJourneyData('adjectives', selectedAdjectives);
    }
  }, [selectedAdjectives, isInitialized]);

  const toggleAdjective = (adjective: string) => {
    if (selectedAdjectives.includes(adjective)) {
      setSelectedAdjectives(selectedAdjectives.filter((a) => a !== adjective));
    } else if (selectedAdjectives.length < 3) {
      setSelectedAdjectives([...selectedAdjectives, adjective]);
    }
  };

  const addToCanvas = () => {
    onAddItem({
      type: 'card',
      content: {
        title: 'My Brand Adjectives',
        description: 'Three words that define my brand essence',
        tags: selectedAdjectives,
      },
    });

    // Also add a completion card
    onAddItem({
      type: 'card',
      content: {
        title: '🎉 Journey Complete!',
        description: 'You have discovered your brand DNA. Export your canvas or continue refining your brand system.',
        tags: ['Ready to Launch'],
      },
    });
  };

  const isComplete = selectedAdjectives.length === 3;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Choose Your Brand Adjectives</h2>
        <p className="text-muted-foreground">
          Pick 3 adjectives that best describe your brand. These will guide your visual direction and voice.
        </p>
      </div>

      {/* Selected Preview */}
      {selectedAdjectives.length > 0 && (
        <div className="mb-6 backdrop-blur-2xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/30 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Your Brand Is...</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {selectedAdjectives.map((adj, idx) => (
              <span
                key={idx}
                className="px-4 py-2 text-lg font-medium rounded-full bg-primary text-primary-foreground shadow-md"
              >
                {adj}
              </span>
            ))}
            {Array.from({ length: 3 - selectedAdjectives.length }).map((_, idx) => (
              <span
                key={`empty-${idx}`}
                className="px-4 py-2 text-lg rounded-full border border-dashed border-primary/30 text-muted-foreground"
              >
                ?
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-6 mb-6">
        {adjectiveCategories.map((cat, catIdx) => (
          <div
            key={catIdx}
            className="backdrop-blur-2xl bg-card/80 border border-border rounded-lg p-6"
          >
            <h3 className="font-semibold mb-4">{cat.category}</h3>
            <div className="flex flex-wrap gap-2">
              {cat.adjectives.map((adj, idx) => (
                <button
                  key={idx}
                  onClick={() => toggleAdjective(adj)}
                  disabled={
                    !selectedAdjectives.includes(adj) && selectedAdjectives.length >= 3
                  }
                  className={`
                    px-4 py-2 rounded-full text-sm font-medium transition-all
                    ${
                      selectedAdjectives.includes(adj)
                        ? 'bg-primary text-primary-foreground shadow-md scale-105'
                        : 'bg-muted hover:bg-muted/80 text-foreground'
                    }
                    ${
                      !selectedAdjectives.includes(adj) && selectedAdjectives.length >= 3
                        ? 'opacity-40 cursor-not-allowed'
                        : 'cursor-pointer'
                    }
                  `}
                >
                  {adj}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {isComplete && (
        <div className="backdrop-blur-2xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-lg p-6 mb-6">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            You're all set!
          </h3>
          <p className="text-sm text-muted-foreground">
            You've completed the brand discovery journey. Add your final card to the canvas and start building with your new brand DNA.
          </p>
        </div>
      )}

      <div className="flex justify-between items-center pt-4 border-t border-[#131718]">
        <p className="text-sm text-muted-foreground">
          {selectedAdjectives.length}/3 selected
        </p>
        <Button onClick={addToCanvas} disabled={!isComplete}>
          Complete Journey & Add to Canvas 🎉
        </Button>
      </div>
    </div>
  );
}