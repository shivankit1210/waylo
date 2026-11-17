import { useApplyPackingTemplate } from '../hooks';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { Sparkles, Bike, Car, Tent, Waves, Briefcase } from 'lucide-react';

interface TemplatePickerModalProps {
  tripId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const TEMPLATES = [
  {
    key: 'MOTORCYCLE_EXPEDITION',
    name: 'Motorcycle Touring Expedition',
    description: 'ECE full-face helmets, armored layers, rain suits, tyre puncture kits, chain lube & tools.',
    icon: Bike,
    color: 'from-blue-600 to-indigo-600',
    itemCount: '17 essential items',
  },
  {
    key: 'ROAD_TRIP',
    name: 'Road Trip Essentials',
    description: 'Vehicle paperwork, fast-chargers, dashboard mounts, emergency cash, travel pillows & snacks.',
    icon: Car,
    color: 'from-emerald-600 to-teal-600',
    itemCount: '11 items',
  },
  {
    key: 'HIKING_CAMPING',
    name: 'High-Altitude Trek & Camping',
    description: 'Sub-zero sleeping bags, dome tent, hiking boots, trekking poles, camp stove & filtration.',
    icon: Tent,
    color: 'from-amber-600 to-orange-600',
    itemCount: '10 items',
  },
  {
    key: 'BEACH_HOLIDAY',
    name: 'Beach & Coastal Holiday',
    description: 'Broad spectrum SPF 50+, swimwear, beach towels, linen shirts, dry-bags & water shoes.',
    icon: Waves,
    color: 'from-cyan-600 to-blue-600',
    itemCount: '8 items',
  },
  {
    key: 'WEEKEND_GETAWAY',
    name: 'Weekend Getaway Capsule',
    description: 'Lightweight 48-hour duffel with clean essentials, chargers, casual layers & toiletries.',
    icon: Briefcase,
    color: 'from-purple-600 to-pink-600',
    itemCount: '7 items',
  },
];

export function TemplatePickerModal({
  tripId,
  open,
  onOpenChange,
  onSuccess,
}: TemplatePickerModalProps) {
  const applyTemplateMutation = useApplyPackingTemplate(tripId);

  const handleApply = async (templateKey: string) => {
    try {
      await applyTemplateMutation.mutateAsync({ templateKey });
      toast.success('Packing template added to your trip!');
      onOpenChange(false);
      onSuccess?.();
    } catch {
      toast.error('Failed to apply packing template');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md sm:max-w-xl rounded-3xl p-6 max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold">Reusable Packing Templates</DialogTitle>
              <DialogDescription className="text-xs">
                Select a curated packing checklist tailored for your travel style
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="grid gap-3 pt-2">
          {TEMPLATES.map((tmpl) => {
            const Icon = tmpl.icon;
            return (
              <Card
                key={tmpl.key}
                className="p-4 rounded-2xl border-border/80 hover:border-primary/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`h-11 w-11 rounded-2xl bg-gradient-to-tr ${tmpl.color} text-white flex items-center justify-center shrink-0 shadow-sm`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-foreground">{tmpl.name}</h4>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-semibold">
                        {tmpl.itemCount}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                      {tmpl.description}
                    </p>
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="gradient"
                  disabled={applyTemplateMutation.isPending}
                  onClick={() => handleApply(tmpl.key)}
                  className="rounded-xl text-xs font-semibold shrink-0 self-end sm:self-center"
                >
                  Use Template
                </Button>
              </Card>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
