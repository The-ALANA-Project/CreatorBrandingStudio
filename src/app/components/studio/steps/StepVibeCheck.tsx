import { useState, useEffect } from 'react';
import { Button } from '@/app/components/ui/button';
import type { CanvasItem, JourneyData } from '@/app/pages/Studio';

interface StepVibeCheckProps {
  onAddItem: (item: Omit<CanvasItem, 'id' | 'position'>) => void;
  onNext: () => void;
  journeyData: JourneyData;
  onUpdateJourneyData: (stepKey: string, data: any) => void;
}

const vibeQuestions = [
  {
    id: 1,
    question: 'When people land on your profile, you want them to think...',
    options: [
      { label: 'This person is a visionary', archetype: 'creator' },
      { label: 'This person knows their stuff', archetype: 'sage' },
      { label: 'This person breaks the rules', archetype: 'rebel' },
      { label: 'This person is warm and welcoming', archetype: 'caregiver' },
      { label: 'This person gets things done', archetype: 'hero' },
      { label: 'This person makes magic happen', archetype: 'magician' },
    ],
  },
  {
    id: 2,
    question: 'Your content feels most alive when you are...',
    options: [
      { label: 'Teaching something new', archetype: 'sage' },
      { label: 'Telling a story', archetype: 'creator' },
      { label: 'Challenging the status quo', archetype: 'rebel' },
      { label: 'Supporting and uplifting others', archetype: 'caregiver' },
      { label: 'Sharing an adventure or discovery', archetype: 'explorer' },
      { label: 'Making people laugh', archetype: 'jester' },
    ],
  },
  {
    id: 3,
    question: 'People come to you for...',
    options: [
      { label: 'Fresh ideas and inspiration', archetype: 'creator' },
      { label: 'Expert knowledge and advice', archetype: 'sage' },
      { label: 'Bold takes and new perspectives', archetype: 'rebel' },
      { label: 'Comfort and encouragement', archetype: 'caregiver' },
      { label: 'Motivation to take action', archetype: 'hero' },
      { label: 'Deep connection and passion', archetype: 'lover' },
    ],
  },
  {
    id: 4,
    question: 'Your ideal audience feels...',
    options: [
      { label: 'Inspired to create', archetype: 'creator' },
      { label: 'Empowered with knowledge', archetype: 'sage' },
      { label: 'Ready to make change', archetype: 'rebel' },
      { label: 'Seen and supported', archetype: 'caregiver' },
      { label: 'Transformed by possibility', archetype: 'magician' },
      { label: 'In control and confident', archetype: 'ruler' },
    ],
  },
  {
    id: 5,
    question: 'Your brand voice is best described as...',
    options: [
      { label: 'Imaginative and expressive', archetype: 'creator' },
      { label: 'Clear and authoritative', archetype: 'sage' },
      { label: 'Bold and unconventional', archetype: 'rebel' },
      { label: 'Warm and genuine', archetype: 'caregiver' },
      { label: 'Free-spirited and authentic', archetype: 'explorer' },
      { label: 'Fun and lighthearted', archetype: 'jester' },
    ],
  },
  {
    id: 6,
    question: 'Success for you looks like...',
    options: [
      { label: 'Creating something beautiful and original', archetype: 'creator' },
      { label: 'Being recognized as an expert', archetype: 'sage' },
      { label: 'Inspiring others to overcome obstacles', archetype: 'hero' },
      { label: 'Turning dreams into reality', archetype: 'magician' },
      { label: 'Building a legacy of influence', archetype: 'ruler' },
      { label: 'Forming deep, meaningful connections', archetype: 'lover' },
    ],
  },
];

export function StepVibeCheck({ onAddItem, onNext, journeyData, onUpdateJourneyData }: StepVibeCheckProps) {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isInitialized, setIsInitialized] = useState(false);

  // Load saved data only on mount
  useEffect(() => {
    if (journeyData.vibeCheckResults && !isInitialized) {
      setAnswers(journeyData.vibeCheckResults);
      setIsInitialized(true);
    } else {
      setIsInitialized(true);
    }
  }, []);

  const handleAnswer = (questionId: number, archetype: string) => {
    const newAnswers = { ...answers, [questionId]: archetype };
    setAnswers(newAnswers);
    onUpdateJourneyData('vibeCheckResults', newAnswers);
  };

  const calculateArchetype = () => {
    const counts: Record<string, number> = {};
    Object.values(answers).forEach((archetype) => {
      counts[archetype] = (counts[archetype] || 0) + 1;
    });

    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    return sorted[0]?.[0] || 'creator';
  };

  const addResultsToCanvas = () => {
    const primaryArchetype = calculateArchetype();
    
    // Store the results for next step to use
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('vibeCheckResults', JSON.stringify(answers));
      sessionStorage.setItem('primaryArchetype', primaryArchetype);
    }

    onNext();
  };

  const allAnswered = Object.keys(answers).length === vibeQuestions.length;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Vibe Check Quiz</h2>
        <p className="text-muted-foreground">
          Please be honest to yourself, when answering the following questions as it will help us understand your brand energy, and as a result your archetype.
        </p>
      </div>

      <div className="space-y-6 mb-6">
        {vibeQuestions.map((q) => (
          <div key={q.id} className="backdrop-blur-2xl bg-card/80 border border-border rounded-lg p-4 sm:p-6">
            <h3 className="font-medium mb-4">{q.question}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {q.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(q.id, option.archetype)}
                  className={`
                    p-3 rounded-lg text-left transition-all
                    ${
                      answers[q.id] === option.archetype
                        ? 'border border-[#131718] bg-[#FEE6EA]'
                        : 'border border-border bg-card/80 backdrop-blur-2xl hover:bg-card/90'
                    }
                  `}
                >
                  <span className="text-sm">{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-[#131718]">
        <p className="text-sm text-muted-foreground">
          {Object.keys(answers).length}/{vibeQuestions.length} answered
        </p>
        <Button onClick={addResultsToCanvas} disabled={!allAnswered}>
          Continue to Results →
        </Button>
      </div>
    </div>
  );
}