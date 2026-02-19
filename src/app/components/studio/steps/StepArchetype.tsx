import { useState, useEffect } from 'react';
import { Button } from '@/app/components/ui/button';
import { motion } from 'motion/react';
import { useDrag } from 'react-dnd';
import type { CanvasItem, JourneyData } from '@/app/pages/Studio';

interface StepArchetypeProps {
  onAddItem: (item: Omit<CanvasItem, 'id' | 'position'>, position?: { x: number; y: number }) => void;
  onNext: () => void;
  journeyData: JourneyData;
  onUpdateJourneyData: (stepKey: string, data: any) => void;
}

const archetypes: Record<string, {
  name: string;
  tagline: string;
  description: string;
  traits: string[];
  supporting: string[];
}> = {
  creator: {
    name: 'The Creator',
    tagline: 'Innovation is your love language',
    description: 'You see the world as a canvas. Your brand thrives on originality, self-expression, and bringing new ideas to life.',
    traits: ['Imaginative', 'Original', 'Expressive', 'Innovative'],
    supporting: ['magician', 'explorer'],
  },
  sage: {
    name: 'The Sage',
    tagline: 'Knowledge is your superpower',
    description: 'You are driven by truth and expertise. Your brand is built on wisdom, clarity, and helping others understand the world.',
    traits: ['Knowledgeable', 'Wise', 'Analytical', 'Thoughtful'],
    supporting: ['ruler', 'magician'],
  },
  rebel: {
    name: 'The Rebel',
    tagline: 'Rules are meant to be rewritten',
    description: 'You challenge conventions and spark change. Your brand disrupts, questions, and liberates.',
    traits: ['Bold', 'Disruptive', 'Brave', 'Revolutionary'],
    supporting: ['hero', 'explorer'],
  },
  caregiver: {
    name: 'The Caregiver',
    tagline: 'Compassion drives everything you do',
    description: 'You nurture, protect, and uplift. Your brand creates safe spaces and genuine connections.',
    traits: ['Nurturing', 'Compassionate', 'Supportive', 'Generous'],
    supporting: ['lover', 'sage'],
  },
  hero: {
    name: 'The Hero',
    tagline: 'You inspire others to rise',
    description: 'You are driven by courage and determination. Your brand is about overcoming challenges, proving what\'s possible, and empowering others to do the same.',
    traits: ['Courageous', 'Determined', 'Inspiring', 'Strong'],
    supporting: ['rebel', 'ruler'],
  },
  magician: {
    name: 'The Magician',
    tagline: 'You turn vision into reality',
    description: 'You believe in transformation and possibility. Your brand is about creating experiences that feel magical and helping others see what could be.',
    traits: ['Transformative', 'Visionary', 'Charismatic', 'Inspiring'],
    supporting: ['creator', 'sage'],
  },
  explorer: {
    name: 'The Explorer',
    tagline: 'Adventure is your calling',
    description: 'You seek authenticity, freedom, and new experiences. Your brand is about discovery, breaking boundaries, and living life on your own terms.',
    traits: ['Adventurous', 'Independent', 'Authentic', 'Curious'],
    supporting: ['rebel', 'creator'],
  },
  lover: {
    name: 'The Lover',
    tagline: 'Connection is everything',
    description: 'You are driven by passion, intimacy, and beauty. Your brand creates emotional resonance and celebrates what makes life worth living.',
    traits: ['Passionate', 'Intimate', 'Aesthetic', 'Emotional'],
    supporting: ['caregiver', 'jester'],
  },
  jester: {
    name: 'The Jester',
    tagline: 'Joy is your superpower',
    description: 'You bring lightness, laughter, and playfulness. Your brand reminds people not to take life too seriously and finds humor in the everyday.',
    traits: ['Playful', 'Entertaining', 'Spontaneous', 'Optimistic'],
    supporting: ['lover', 'explorer'],
  },
  ruler: {
    name: 'The Ruler',
    tagline: 'You lead with authority',
    description: 'You create order, stability, and success. Your brand is about leadership, responsibility, and building something that lasts.',
    traits: ['Authoritative', 'Organized', 'Confident', 'Strategic'],
    supporting: ['sage', 'hero'],
  },
};

function DraggableSupportingArchetype({ 
  archetype 
}: { 
  archetype: typeof archetypes[keyof typeof archetypes] 
}) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'CARD',
    item: {
      isNew: true,
      archetype: archetype,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [archetype]);

  return (
    <div
      ref={drag}
      className={`
        p-3 rounded-lg bg-muted/30 border border-dashed border-muted-foreground/30
        cursor-move transition-all
        hover:border-muted-foreground/50 hover:bg-muted/40
        ${isDragging ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}
      `}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-muted-foreground mb-0.5">
            {archetype.name}
          </div>
          <div className="text-xs text-muted-foreground/70 italic">
            {archetype.tagline}
          </div>
        </div>
        <div className="text-xs text-muted-foreground/50 whitespace-nowrap">
          Drag to add
        </div>
      </div>
      {isDragging && (
        <div className="text-xs text-muted-foreground/60 mt-2">Drop on canvas</div>
      )}
    </div>
  );
}

function DraggablePrimaryArchetype({ 
  archetype 
}: { 
  archetype: typeof archetypes[keyof typeof archetypes] 
}) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'CARD',
    item: {
      isNew: true,
      archetype: archetype,
      isPrimary: true, // Mark as primary archetype
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [archetype]);

  return (
    <div
      ref={drag}
      className={`
        cursor-move transition-all
        ${isDragging ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}
      `}
    >
      <h3 className="font-semibold mb-3">Your Brand Energy</h3>
      <p className="text-muted-foreground mb-4">{archetype.description}</p>
      <div className="flex flex-wrap gap-2 mb-3">
        {archetype.traits.map((trait, idx) => (
          <span
            key={idx}
            className="px-3 py-1 text-sm rounded-full bg-primary/10 text-primary border border-primary/20"
          >
            {trait}
          </span>
        ))}
      </div>
      <div className="text-xs text-muted-foreground/50 text-left">
        Drag to add to canvas
      </div>
      {isDragging && (
        <div className="text-xs text-muted-foreground/60 mt-2 text-center">Drop on canvas</div>
      )}
    </div>
  );
}

export function StepArchetype({ onAddItem, onNext, journeyData, onUpdateJourneyData }: StepArchetypeProps) {
  const [primaryArchetype, setPrimaryArchetype] = useState<string>('creator');
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    // Get the primary archetype from the previous step
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('primaryArchetype');
      if (stored) {
        setPrimaryArchetype(stored);
      }
    }

    // Trigger reveal animation after a short delay
    const timer = setTimeout(() => setRevealed(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const archetype = archetypes[primaryArchetype];
  const supportingArchetypes = archetype.supporting.map(id => archetypes[id]);

  const handleContinue = () => {
    // Add primary archetype to canvas with automatic positioning
    onAddItem({
      type: 'card',
      content: {
        title: 'Primary Archetype',
        description: `${archetype.name} - ${archetype.tagline}`,
        tags: archetype.traits,
        variant: 'primary-archetype',
      },
    }); // Let automatic positioning handle placement

    // Store for next step
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('archetypeData', JSON.stringify({
        primary: primaryArchetype,
        supporting: archetype.supporting,
      }));
    }

    // Update journey data
    onUpdateJourneyData('archetype', {
      primary: primaryArchetype,
      supporting: archetype.supporting,
    });

    onNext();
  };

  return (
    <div>
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: revealed ? 1 : 0, y: revealed ? 0 : 20 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-semibold mb-2">You are {archetype.name}</h2>
          <p className="text-muted-foreground">{archetype.tagline}</p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: revealed ? 1 : 0 }}
        transition={{ delay: 0.6 }}
        className="space-y-6"
      >
        {/* Primary Description */}
        <div className="backdrop-blur-2xl bg-card/80 border border-border rounded-lg p-6">
          <DraggablePrimaryArchetype archetype={archetype} />
        </div>

        {/* Supporting Archetypes */}
        <div className="backdrop-blur-2xl bg-card/80 border border-border rounded-lg p-6">
          <h3 className="font-semibold mb-3">Your Supporting Energies</h3>
          <p className="text-sm text-muted-foreground mb-4">
            These archetypes complement your primary energy and add depth to your brand.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {supportingArchetypes.map((supporting, idx) => (
              <DraggableSupportingArchetype key={idx} archetype={supporting} />
            ))}
          </div>
        </div>
      </motion.div>

      <div className="flex justify-end pt-6 border-t border-[#131718] mt-6">
        <Button onClick={handleContinue}>
          Add to Canvas & Continue
        </Button>
      </div>
    </div>
  );
}