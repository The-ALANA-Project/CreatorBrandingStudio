import { useState, useEffect } from 'react';
import { Button } from '@/app/components/ui/button';
import type { CanvasItem, JourneyData } from '@/app/pages/Studio';

interface StepMotivationsProps {
  onAddItem: (item: Omit<CanvasItem, 'id' | 'position'>) => void;
  onNext: () => void;
  journeyData: JourneyData;
  onUpdateJourneyData: (stepKey: string, data: any) => void;
}

const archetypeMotivations: Record<string, {
  motivations: string[];
  fears: string[];
  desires: string[];
}> = {
  creator: {
    motivations: [
      'Express your unique vision',
      'Innovate and create something new',
      'Inspire others to create',
    ],
    fears: [
      'Being unoriginal or derivative',
      'Creative block or stagnation',
      'Compromising artistic integrity',
    ],
    desires: [
      'Build something that lasts',
      'Be recognized for your originality',
      'Create meaningful impact through your work',
    ],
  },
  sage: {
    motivations: [
      'Share knowledge and expertise',
      'Help others understand complex topics',
      'Discover and spread truth',
    ],
    fears: [
      'Being wrong or misinformed',
      'Spreading misinformation',
      'Being seen as ignorant',
    ],
    desires: [
      'Be trusted as an authority',
      'Contribute to collective wisdom',
      'Help others make informed decisions',
    ],
  },
  rebel: {
    motivations: [
      'Challenge the status quo',
      'Create positive disruption',
      'Empower others to think differently',
    ],
    fears: [
      'Becoming too mainstream',
      'Losing your edge or authenticity',
      'Being silenced or ignored',
    ],
    desires: [
      'Spark meaningful change',
      'Build a movement',
      'Be seen as a trailblazer',
    ],
  },
  caregiver: {
    motivations: [
      'Support and uplift others',
      'Create a welcoming community',
      'Make people feel seen and valued',
    ],
    fears: [
      'Letting people down',
      'Being taken advantage of',
      'Not doing enough to help',
    ],
    desires: [
      'Build genuine connections',
      'Be a source of comfort and guidance',
      'Create safe, inclusive spaces',
    ],
  },
  hero: {
    motivations: [
      'Inspire others to overcome challenges',
      'Prove what\'s possible through action',
      'Make a measurable impact',
    ],
    fears: [
      'Failure or defeat',
      'Being seen as weak',
      'Not living up to expectations',
    ],
    desires: [
      'Be recognized for your achievements',
      'Empower others to rise',
      'Leave a legacy of courage',
    ],
  },
  magician: {
    motivations: [
      'Transform dreams into reality',
      'Create magical experiences',
      'Show others what\'s possible',
    ],
    fears: [
      'Being exposed as inauthentic',
      'Losing the ability to inspire',
      'Creating empty promises',
    ],
    desires: [
      'Be seen as transformative',
      'Help others believe in possibility',
      'Create moments that change lives',
    ],
  },
  explorer: {
    motivations: [
      'Discover new experiences',
      'Live authentically and freely',
      'Break boundaries and conventions',
    ],
    fears: [
      'Being trapped or confined',
      'Missing out on experiences',
      'Losing your independence',
    ],
    desires: [
      'Live life on your own terms',
      'Inspire others to explore',
      'Find and share authentic experiences',
    ],
  },
  lover: {
    motivations: [
      'Create deep emotional connections',
      'Celebrate beauty and passion',
      'Build intimate relationships',
    ],
    fears: [
      'Being unloved or rejected',
      'Emotional disconnection',
      'Living without passion',
    ],
    desires: [
      'Be deeply connected with others',
      'Create emotionally resonant work',
      'Celebrate what makes life beautiful',
    ],
  },
  jester: {
    motivations: [
      'Bring joy and lightness to others',
      'Find humor in everyday moments',
      'Remind people not to take life too seriously',
    ],
    fears: [
      'Being boring or irrelevant',
      'Not being taken seriously when it matters',
      'Losing your sense of play',
    ],
    desires: [
      'Make people smile and laugh',
      'Create moments of spontaneous joy',
      'Be remembered for bringing lightness',
    ],
  },
  ruler: {
    motivations: [
      'Build something that lasts',
      'Lead with authority and clarity',
      'Create order and stability',
    ],
    fears: [
      'Losing control or authority',
      'Being undermined or disrespected',
      'Creating chaos or instability',
    ],
    desires: [
      'Be recognized as a leader',
      'Build a lasting legacy',
      'Create systems that work',
    ],
  },
};

export function StepMotivations({ onAddItem, onNext, journeyData, onUpdateJourneyData }: StepMotivationsProps) {
  const [archetype, setArchetype] = useState<string>('creator');
  const [selectedMotivations, setSelectedMotivations] = useState<string[]>([]);
  const [selectedFears, setSelectedFears] = useState<string[]>([]);
  const [selectedDesires, setSelectedDesires] = useState<string[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const data = sessionStorage.getItem('archetypeData');
      if (data) {
        const parsed = JSON.parse(data);
        setArchetype(parsed.primary);
      }
    }
  }, []);

  // Load saved data only on mount
  useEffect(() => {
    if (journeyData.motivations && !isInitialized) {
      if (journeyData.motivations.motivations) setSelectedMotivations(journeyData.motivations.motivations);
      if (journeyData.motivations.fears) setSelectedFears(journeyData.motivations.fears);
      if (journeyData.motivations.desires) setSelectedDesires(journeyData.motivations.desires);
      setIsInitialized(true);
    } else {
      setIsInitialized(true);
    }
  }, [journeyData]);

  // Save data whenever selections change
  useEffect(() => {
    if (isInitialized) {
      onUpdateJourneyData('motivations', {
        motivations: selectedMotivations,
        fears: selectedFears,
        desires: selectedDesires,
      });
    }
  }, [selectedMotivations, selectedFears, selectedDesires, isInitialized]);

  const motivations = archetypeMotivations[archetype];

  const toggleItem = (
    item: string,
    list: string[],
    setList: (list: string[]) => void
  ) => {
    if (list.includes(item)) {
      setList(list.filter((i) => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const addToCanvas = () => {
    onAddItem({
      type: 'card',
      content: {
        title: 'Core Motivations & Desires',
        description: 'What drives my brand forward',
        tags: [...selectedMotivations, ...selectedDesires].slice(0, 4),
      },
    });

    // Store for potential future use
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('motivations', JSON.stringify({
        motivations: selectedMotivations,
        fears: selectedFears,
        desires: selectedDesires,
      }));
    }

    // Update journey data
    onUpdateJourneyData('motivations', {
      motivations: selectedMotivations,
      fears: selectedFears,
      desires: selectedDesires,
    });

    onNext();
  };

  const hasSelections = 
    selectedMotivations.length > 0 || 
    selectedFears.length > 0 || 
    selectedDesires.length > 0;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Core Motivations & Desires</h2>
        <p className="text-muted-foreground">
          Select what resonates with you. This helps define your brand's deeper purpose.
        </p>
      </div>

      <div className="space-y-6 mb-6">
        {/* Motivations */}
        <div className="backdrop-blur-2xl bg-card/80 border border-border rounded-lg p-6">
          <h3 className="font-semibold mb-1 flex items-center gap-2">
            What Motivates You
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            The driving forces behind your brand
          </p>
          <div className="space-y-2">
            {motivations.motivations.map((motivation, idx) => (
              <button
                key={idx}
                onClick={() =>
                  toggleItem(motivation, selectedMotivations, setSelectedMotivations)
                }
                className={`
                  w-full p-3 rounded-lg border text-left text-sm transition-all
                  ${
                    selectedMotivations.includes(motivation)
                      ? 'border-[#FEE6EA] bg-[#FEE6EA]/80 outline outline-1 outline-[#131718]'
                      : 'border-border bg-white hover:bg-white/90'
                  }
                `}
              >
                {motivation}
              </button>
            ))}
          </div>
        </div>

        {/* Fears */}
        <div className="backdrop-blur-2xl bg-card/80 border border-border rounded-lg p-6">
          <h3 className="font-semibold mb-1 flex items-center gap-2">
            What You Want to Avoid
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Understanding your boundaries helps shape your brand values
          </p>
          <div className="space-y-2">
            {motivations.fears.map((fear, idx) => (
              <button
                key={idx}
                onClick={() => toggleItem(fear, selectedFears, setSelectedFears)}
                className={`
                  w-full p-3 rounded-lg border text-left text-sm transition-all
                  ${
                    selectedFears.includes(fear)
                      ? 'border-[#FEE6EA] bg-[#FEE6EA]/80 outline outline-1 outline-[#131718]'
                      : 'border-border bg-white hover:bg-white/90'
                  }
                `}
              >
                {fear}
              </button>
            ))}
          </div>
        </div>

        {/* Desires */}
        <div className="backdrop-blur-2xl bg-card/80 border border-border rounded-lg p-6">
          <h3 className="font-semibold mb-1 flex items-center gap-2">
            Your Ultimate Goals
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            What you're working toward with your brand
          </p>
          <div className="space-y-2">
            {motivations.desires.map((desire, idx) => (
              <button
                key={idx}
                onClick={() => toggleItem(desire, selectedDesires, setSelectedDesires)}
                className={`
                  w-full p-3 rounded-lg border text-left text-sm transition-all
                  ${
                    selectedDesires.includes(desire)
                      ? 'border-[#FEE6EA] bg-[#FEE6EA]/80 outline outline-1 outline-[#131718]'
                      : 'border-border bg-white hover:bg-white/90'
                  }
                `}
              >
                {desire}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-[#131718]">
        <p className="text-sm text-muted-foreground">
          {selectedMotivations.length + selectedFears.length + selectedDesires.length} selected
        </p>
        <Button onClick={addToCanvas} disabled={!hasSelections}>
          Add to Canvas & Continue →
        </Button>
      </div>
    </div>
  );
}