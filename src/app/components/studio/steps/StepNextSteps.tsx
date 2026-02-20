import { Button } from '@/app/components/ui/button';
import { CheckCircle2, Circle, ExternalLink, Download } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { CanvasItem, JourneyData } from '@/app/pages/Studio';

interface StepNextStepsProps {
  onAddItem: (item: Omit<CanvasItem, 'id' | 'position'>) => void;
  onAddItemsVertical?: (items: Omit<CanvasItem, 'id' | 'position'>[]) => void;
  onNext: () => void;
  journeyData: JourneyData;
  onUpdateJourneyData: (stepKey: string, data: any) => void;
  onDownloadProgress?: () => void;
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

export function StepNextSteps({ onAddItem, onNext, journeyData, onUpdateJourneyData, onDownloadProgress }: StepNextStepsProps) {
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
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Next Steps</h2>
        <p className="text-muted-foreground">
          Check off the deliverables you'll need. This creates your final project checklist—drag it to your canvas and download your complete brief as JSON.
        </p>
      </div>

      {/* Deliverables Checklist */}
      <div className="space-y-4">
        {/* Essential */}
        <div className="space-y-2">
          <h3 className="font-semibold text-muted-foreground uppercase tracking-wider mb-3 text-[14px]">
            Essential
          </h3>
          {deliverables
            .filter(d => d.priority === 'essential')
            .map(deliverable => (
              <button
                key={deliverable.id}
                onClick={() => toggleDeliverable(deliverable.id)}
                className={`w-full flex items-start gap-3 p-4 rounded-lg border transition-all text-left ${
                  selectedDeliverables.includes(deliverable.id)
                    ? 'border-[#131718] bg-[#FEE6EA]'
                    : 'border-border bg-card/80 backdrop-blur-2xl hover:border-[#131718]/40'
                }`}
              >
                {selectedDeliverables.includes(deliverable.id) ? (
                  <CheckCircle2 className="w-5 h-5 text-[#131718] flex-shrink-0 mt-0.5" />
                ) : (
                  <Circle className="w-5 h-5 text-muted-foreground/40 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <h4 className="font-medium text-foreground">{deliverable.title}</h4>
                  <p className="text-sm text-muted-foreground mt-0.5">{deliverable.description}</p>
                </div>
              </button>
            ))}
        </div>

        {/* Recommended */}
        <div className="space-y-2">
          <h3 className="font-semibold text-muted-foreground uppercase tracking-wider mb-3 text-[14px]">
            Recommended
          </h3>
          {deliverables
            .filter(d => d.priority === 'recommended')
            .map(deliverable => (
              <button
                key={deliverable.id}
                onClick={() => toggleDeliverable(deliverable.id)}
                className={`w-full flex items-start gap-3 p-4 rounded-lg border transition-all text-left ${
                  selectedDeliverables.includes(deliverable.id)
                    ? 'border-[#131718] bg-[#FEE6EA]'
                    : 'border-border bg-card/80 backdrop-blur-2xl hover:border-[#131718]/40'
                }`}
              >
                {selectedDeliverables.includes(deliverable.id) ? (
                  <CheckCircle2 className="w-5 h-5 text-[#131718] flex-shrink-0 mt-0.5" />
                ) : (
                  <Circle className="w-5 h-5 text-muted-foreground/40 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <h4 className="font-medium text-foreground">{deliverable.title}</h4>
                  <p className="text-sm text-muted-foreground mt-0.5">{deliverable.description}</p>
                </div>
              </button>
            ))}
        </div>

        {/* Optional */}
        <div className="space-y-2">
          <h3 className="font-semibold text-muted-foreground uppercase tracking-wider mb-3 text-[14px]">
            Optional
          </h3>
          {deliverables
            .filter(d => d.priority === 'optional')
            .map(deliverable => (
              <button
                key={deliverable.id}
                onClick={() => toggleDeliverable(deliverable.id)}
                className={`w-full flex items-start gap-3 p-4 rounded-lg border transition-all text-left ${
                  selectedDeliverables.includes(deliverable.id)
                    ? 'border-[#131718] bg-[#FEE6EA]'
                    : 'border-border bg-card/80 backdrop-blur-2xl hover:border-[#131718]/40'
                }`}
              >
                {selectedDeliverables.includes(deliverable.id) ? (
                  <CheckCircle2 className="w-5 h-5 text-[#131718] flex-shrink-0 mt-0.5" />
                ) : (
                  <Circle className="w-5 h-5 text-muted-foreground/40 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <h4 className="font-medium text-foreground">{deliverable.title}</h4>
                  <p className="text-sm text-muted-foreground mt-0.5">{deliverable.description}</p>
                </div>
              </button>
            ))}
        </div>
      </div>

      {/* Brand Guidelines Resource */}
      <div className="mt-6">
        <a
          href="https://www.brandguidelines.net/"
          target="_blank"
          rel="noopener noreferrer"
          className="block p-4 rounded-lg border border-[#131718] bg-[#131718] hover:bg-[#131718]/90 transition-all group"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <h4 className="font-semibold text-white mb-1 flex items-center gap-2">
                Brand Guidelines Gallery
                <ExternalLink className="w-4 h-4 opacity-60 group-hover:opacity-100 transition-opacity" />
              </h4>
              <p className="text-sm text-white/70">
                Explore professional brand guideline examples from top companies
              </p>
            </div>
          </div>
        </a>
      </div>

      {/* Final CTA Button */}
      <div className="flex justify-between items-center pt-6 mt-6 border-t border-[#131718]">
        <p className="text-sm text-muted-foreground">
          {selectedDeliverables.length} deliverable{selectedDeliverables.length !== 1 ? 's' : ''} selected
        </p>
        <Button
          onClick={() => {
            // Add checklist to canvas
            const selectedItems = deliverables.filter(d => selectedDeliverables.includes(d.id));
            onAddItem({
              type: 'card',
              content: {
                title: 'Project Deliverables Checklist',
                description: 'You selected these assets to be designed as your next step. Keep going, either by yourself or by looking for a talented designer from our network.',
                tags: selectedItems.map(d => d.title),
              },
            });
            
            // Trigger JSON download
            if (onDownloadProgress) {
              onDownloadProgress();
            }
          }}
          className="flex items-center gap-2"
        >
          
          Add to Canvas & Download JSON
        </Button>
      </div>
    </div>
  );
}