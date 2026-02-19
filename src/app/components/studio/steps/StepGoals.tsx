import { useState, useEffect } from 'react';
import { Button } from '@/app/components/ui/button';
import { useDrag } from 'react-dnd';
import type { CanvasItem, JourneyData } from '@/app/pages/Studio';

interface StepGoalsProps {
  onAddItem: (item: Omit<CanvasItem, 'id' | 'position'>) => void;
  onNext: () => void;
  journeyData: JourneyData;
  onUpdateJourneyData: (stepKey: string, data: any) => void;
}

const goalOptions = [
  { id: 'clients', label: 'Attract ideal clients' },
  { id: 'collabs', label: 'Land brand collaborations' },
  { id: 'audience', label: 'Grow engaged audience' },
  { id: 'community', label: 'Build a community' },
  { id: 'products', label: 'Sell products/services' },
  { id: 'thought-leader', label: 'Become a thought leader' },
];

function DraggableGoalCard({ goal, isSelected }: { goal: typeof goalOptions[0]; isSelected: boolean }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'CARD',
    item: {
      isNew: true,
      goal: goal,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [goal]);

  return (
    <div
      ref={drag}
      className={`
        p-4 rounded-lg border transition-all cursor-move
        ${isDragging ? 'opacity-50' : 'opacity-100'}
        ${
          isSelected
            ? 'border-[#131718] bg-[#FEE6EA]'
            : 'border-border bg-card/80 backdrop-blur-2xl'
        }
      `}
    >
      <div className="text-sm font-medium">{goal.label}</div>
      {isDragging && (
        <div className="text-xs text-muted-foreground mt-1">Drop on canvas</div>
      )}
    </div>
  );
}

export function StepGoals({ onAddItem, onNext, journeyData, onUpdateJourneyData }: StepGoalsProps) {
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load saved data only on mount
  useEffect(() => {
    if (journeyData.goals && !isInitialized) {
      setSelectedGoals(journeyData.goals);
      setIsInitialized(true);
    }
  }, []);

  // Save selections whenever they change (but not on initial load)
  useEffect(() => {
    if (isInitialized && selectedGoals.length > 0) {
      onUpdateJourneyData('goals', selectedGoals);
    }
  }, [selectedGoals, isInitialized]);

  const toggleGoal = (goalId: string) => {
    if (selectedGoals.includes(goalId)) {
      setSelectedGoals(selectedGoals.filter((id) => id !== goalId));
    } else if (selectedGoals.length < 2) {
      setSelectedGoals([...selectedGoals, goalId]);
    }
  };

  const addGoalsToCanvas = () => {
    const selected = goalOptions.filter((g) => selectedGoals.includes(g.id));
    
    onAddItem({
      type: 'card',
      content: {
        title: 'My Brand Goals',
        description: 'What I want to achieve with my personal brand',
        tags: selected.map((g) => g.label),
      },
    });

    onUpdateJourneyData('goals', selectedGoals);
    onNext();
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">What are your main goals?</h2>
        <p className="text-muted-foreground">
          Pick 1-2 goals that matter most to you right now. Click to select, and add them to the canvas by clicking the "Continue" button below.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {goalOptions.map((goal) => (
          <button
            key={goal.id}
            onClick={() => toggleGoal(goal.id)}
            className="text-left"
          >
            <DraggableGoalCard
              goal={goal}
              isSelected={selectedGoals.includes(goal.id)}
            />
          </button>
        ))}
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-[#131718]">
        <p className="text-sm text-muted-foreground">
          {selectedGoals.length}/2 selected
        </p>
        <Button
          onClick={addGoalsToCanvas}
          disabled={selectedGoals.length === 0}
        >
          Add to Canvas & Continue →
        </Button>
      </div>
    </div>
  );
}