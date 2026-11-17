import { useState } from 'react';
import {
  Radio,
  AlertTriangle,
  MapPin,
  Fuel,
  Wrench,
  Camera,
  MessageSquare,
  Send,
  ShieldAlert,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PingType } from '@waylo/shared';

interface CrewPingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSendPing: (type: PingType, message?: string) => void;
  isLoading?: boolean;
}

const PING_PRESETS = [
  {
    type: PingType.SOS_EMERGENCY,
    label: 'Emergency SOS Beacon',
    desc: 'High priority alert broadcasted with sound/vibration to all crew.',
    icon: ShieldAlert,
    color: 'bg-red-500/15 text-red-600 border-red-500/40 hover:bg-red-500/25',
  },
  {
    type: PingType.REGROUP,
    label: 'Convoy Regroup',
    desc: 'Please pull over safely at the next scenic turnout.',
    icon: MapPin,
    color: 'bg-blue-500/15 text-blue-600 border-blue-500/40 hover:bg-blue-500/25',
  },
  {
    type: PingType.FUEL_STOP,
    label: 'Refuel / Charging Stop',
    desc: 'Need to stop at the next petrol pump or charging station.',
    icon: Fuel,
    color: 'bg-amber-500/15 text-amber-600 border-amber-500/40 hover:bg-amber-500/25',
  },
  {
    type: PingType.MECHANICAL_STOP,
    label: 'Mechanical / Tyre Check',
    desc: 'Stopping for tyre pressure, chain lube, or mechanical inspection.',
    icon: Wrench,
    color: 'bg-orange-500/15 text-orange-600 border-orange-500/40 hover:bg-orange-500/25',
  },
  {
    type: PingType.PHOTO_STOP,
    label: 'Scenic Viewpoint Stop',
    desc: 'Scenic twisty viewpoint! Pulling over 5 minutes for photos.',
    icon: Camera,
    color: 'bg-emerald-500/15 text-emerald-600 border-emerald-500/40 hover:bg-emerald-500/25',
  },
];

export function CrewPingDialog({
  open,
  onOpenChange,
  onSendPing,
  isLoading = false,
}: CrewPingDialogProps) {
  const [selectedType, setSelectedType] = useState<PingType>(PingType.REGROUP);
  const [customMessage, setCustomMessage] = useState('');

  const handleSend = () => {
    onSendPing(selectedType, customMessage.trim() || undefined);
    setCustomMessage('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-6 rounded-3xl">
        <DialogHeader className="space-y-1">
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
            <Radio className="h-4 w-4 animate-pulse text-emerald-500" />
            <span>Broadcast Crew Ping</span>
          </div>
          <DialogTitle className="text-xl font-bold">Transmit Alert to Convoy</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Instantly notifies all active riders on their phone screens and drops a map beacon at your GPS coordinates.
          </DialogDescription>
        </DialogHeader>

        {/* Preset Cards */}
        <div className="space-y-2 py-2">
          {PING_PRESETS.map((preset) => {
            const Icon = preset.icon;
            const isSelected = selectedType === preset.type;
            return (
              <button
                key={preset.type}
                type="button"
                onClick={() => setSelectedType(preset.type)}
                className={`w-full p-3 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                  isSelected
                    ? `${preset.color} ring-2 ring-primary/40 shadow-sm font-semibold`
                    : 'border-border/70 hover:bg-muted/40 text-muted-foreground'
                }`}
              >
                <div className="h-8 w-8 rounded-xl bg-background/80 flex items-center justify-center shrink-0 mt-0.5">
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">{preset.label}</p>
                  <p className="text-[11px] leading-relaxed mt-0.5">{preset.desc}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Optional Custom Note */}
        <div className="space-y-1 pt-1">
          <label className="text-xs font-semibold text-muted-foreground block">
            Optional Custom Message:
          </label>
          <Input
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            placeholder="e.g. Turnout is 2 km ahead on the left side"
            className="rounded-xl text-xs"
          />
        </div>

        <DialogFooter className="pt-4 border-t border-border/60 flex items-center justify-between">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="rounded-xl text-xs"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSend}
            disabled={isLoading}
            className={`rounded-xl font-bold text-xs gap-1.5 text-white ${
              selectedType === PingType.SOS_EMERGENCY
                ? 'bg-red-600 hover:bg-red-700 shadow-lg shadow-red-500/25'
                : 'bg-primary hover:bg-primary/90'
            }`}
          >
            <Send className="h-3.5 w-3.5" />
            <span>Transmit Beacon</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
