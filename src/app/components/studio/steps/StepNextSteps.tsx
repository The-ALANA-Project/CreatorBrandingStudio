import { Button } from '@/app/components/ui/button';
import { CheckCircle2, Circle, ExternalLink } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { CanvasItem, JourneyData } from '@/app/pages/Studio';

interface StepNextStepsProps {
  onAddItem: (item: Omit<CanvasItem, 'id' | 'position'>) => void;
  onNext: () => void;
  journeyData: JourneyData;
  onUpdateJourneyData: (stepKey: string, data: any) => void;
}

interface Deliverable {
  id: string;
  title: string;
  description: string;
  priority: 'essential' | 'recommended' | 'optional';
}

const deliverables: Deliverable[] = [
  {
    id: 'logo',
    title: 'Logo Design',
    description: 'Primary logo + variations (icon, wordmark, stacked)',
    priority: 'essential',
  },
  {
    id: 'brand-guide',
    title: 'Brand Style Guide',
    description: 'Complete visual guidelines including colors, typography, and usage rules',
    priority: 'essential',
  },
  {
    id: 'social-templates',
    title: 'Social Media Templates',
    description: 'Instagram, LinkedIn, Twitter/X post and story templates',
    priority: 'recommended',
  },
  {
    id: 'website',
    title: 'Website Design',
    description: 'Landing page or full website design matching your brand',
    priority: 'recommended',
  },
  {
    id: 'business-cards',
    title: 'Business Cards',
    description: 'Professional print-ready business card design',
    priority: 'recommended',
  },
  {
    id: 'presentation',
    title: 'Presentation Templates',
    description: 'Pitch deck or general presentation templates',
    priority: 'optional',
  },
  {
    id: 'email-signature',
    title: 'Email Signature',
    description: 'Branded email signature design',
    priority: 'optional',
  },
  {
    id: 'stationery',
    title: 'Stationery & Print',
    description: 'Letterhead, envelopes, notecards, and other print materials',
    priority: 'optional',
  },
  {
    id: 'icons-illustrations',
    title: 'Custom Icons & Illustrations',
    description: 'Unique visual assets aligned with your brand language',
    priority: 'optional',
  },
];

export function StepNextSteps({ onAddItem, onNext, journeyData, onUpdateJourneyData }: StepNextStepsProps) {
  const [selectedDeliverables, setSelectedDeliverables] = useState<string[]>([
    'logo',
    'brand-guide',
  ]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load saved data only on mount
  useEffect(() => {
    if (journeyData.nextSteps && !isInitialized) {
      setSelectedDeliverables(journeyData.nextSteps);
      setIsInitialized(true);
    } else {
      setIsInitialized(true);
    }
  }, []);

  // Save data whenever selections change
  useEffect(() => {
    if (isInitialized) {
      onUpdateJourneyData('nextSteps', selectedDeliverables);
    }
  }, [selectedDeliverables, isInitialized]);

  const toggleDeliverable = (id: string) => {
    setSelectedDeliverables(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'essential':
        return 'text-red-600';
      case 'recommended':
        return 'text-orange-600';
      case 'optional':
        return 'text-blue-600';
      default:
        return 'text-foreground';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'essential':
        return 'Essential';
      case 'recommended':
        return 'Recommended';
      case 'optional':
        return 'Optional';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6 pb-6">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-foreground">Next Steps</h2>
        <p className="text-sm text-muted-foreground">
          Select deliverables you'd like to create yourself or have a designer help you with. This becomes your project scope.
        </p>
      </div>

      {/* Deliverables Checklist */}
      <div className="space-y-3">
        {/* Essential */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-1 flex-1 bg-red-200 rounded" />
            <h3 className="text-sm font-semibold text-red-600 uppercase tracking-wide">Essential</h3>
            <div className="h-1 flex-1 bg-red-200 rounded" />
          </div>
          {deliverables
            .filter(d => d.priority === 'essential')
            .map(deliverable => (
              <button
                key={deliverable.id}
                onClick={() => toggleDeliverable(deliverable.id)}
                className="w-full flex items-start gap-3 p-4 rounded-xl border border-white/30 bg-white/10 backdrop-blur-sm transition-all hover:bg-white/20 hover:scale-[1.02] text-left"
              >
                {selectedDeliverables.includes(deliverable.id) ? (
                  <CheckCircle2 className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <Circle className="w-5 h-5 text-foreground/40 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <h4 className="font-medium text-foreground">{deliverable.title}</h4>
                  <p className="text-xs text-foreground/70 mt-0.5">{deliverable.description}</p>
                </div>
              </button>
            ))}
        </div>

        {/* Recommended */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center gap-2">
            <div className="h-1 flex-1 bg-orange-200 rounded" />
            <h3 className="text-sm font-semibold text-orange-600 uppercase tracking-wide">Recommended</h3>
            <div className="h-1 flex-1 bg-orange-200 rounded" />
          </div>
          {deliverables
            .filter(d => d.priority === 'recommended')
            .map(deliverable => (
              <button
                key={deliverable.id}
                onClick={() => toggleDeliverable(deliverable.id)}
                className="w-full flex items-start gap-3 p-4 rounded-xl border border-white/30 bg-white/10 backdrop-blur-sm transition-all hover:bg-white/20 hover:scale-[1.02] text-left"
              >
                {selectedDeliverables.includes(deliverable.id) ? (
                  <CheckCircle2 className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <Circle className="w-5 h-5 text-foreground/40 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <h4 className="font-medium text-foreground">{deliverable.title}</h4>
                  <p className="text-xs text-foreground/70 mt-0.5">{deliverable.description}</p>
                </div>
              </button>
            ))}
        </div>

        {/* Optional */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center gap-2">
            <div className="h-1 flex-1 bg-blue-200 rounded" />
            <h3 className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Optional</h3>
            <div className="h-1 flex-1 bg-blue-200 rounded" />
          </div>
          {deliverables
            .filter(d => d.priority === 'optional')
            .map(deliverable => (
              <button
                key={deliverable.id}
                onClick={() => toggleDeliverable(deliverable.id)}
                className="w-full flex items-start gap-3 p-4 rounded-xl border border-white/30 bg-white/10 backdrop-blur-sm transition-all hover:bg-white/20 hover:scale-[1.02] text-left"
              >
                {selectedDeliverables.includes(deliverable.id) ? (
                  <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <Circle className="w-5 h-5 text-foreground/40 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <h4 className="font-medium text-foreground">{deliverable.title}</h4>
                  <p className="text-xs text-foreground/70 mt-0.5">{deliverable.description}</p>
                </div>
              </button>
            ))}
        </div>
      </div>

      {/* Summary */}
      <div className="p-4 rounded-xl bg-white/20 border border-white/30 backdrop-blur-sm">
        <p className="text-sm text-foreground/80">
          <strong>{selectedDeliverables.length}</strong> deliverable{selectedDeliverables.length !== 1 ? 's' : ''} selected
        </p>
      </div>

      {/* Next Steps CTA */}
      <div className="space-y-3 pt-2">
        {/* Brand Guidelines Resource */}
        <a
          href="https://www.brandguidelines.net/"
          target="_blank"
          rel="noopener noreferrer"
          className="block p-4 rounded-xl bg-gradient-to-br from-[#131718]/80 to-[#131718]/60 border border-white/20 backdrop-blur-sm hover:border-white/40 transition-all group"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <h4 className="font-semibold text-white mb-1 flex items-center gap-2">
                Brand Guidelines Gallery
                <ExternalLink className="w-4 h-4 opacity-60 group-hover:opacity-100 transition-opacity" />
              </h4>
              <p className="text-sm text-white/70 mb-2">
                Explore professional brand guideline examples from top companies for inspiration on how to structure your own.
              </p>
              <p className="text-xs text-white/50">
                brandguidelines.net
              </p>
            </div>
          </div>
        </a>
        
        <div className="p-4 rounded-xl bg-gradient-to-br from-[#FEE6EA]/50 to-[#FFD4DC]/50 border border-white/40 backdrop-blur-sm">
          <h4 className="font-semibold text-foreground mb-2">Ready to bring your brand to life?</h4>
          <p className="text-sm text-foreground/70 mb-3">
            Your custom brand brief is complete! You can now use this canvas as a reference to work with a designer or start creating yourself.
          </p>
          <ul className="text-xs text-foreground/70 space-y-1 ml-4 list-disc">
            <li>Export your canvas as an image</li>
            <li>Share with designers from your network</li>
            <li>Use as a reference guide for DIY branding</li>
          </ul>
        </div>
      </div>
    </div>
  );
}