import { useState } from 'react';
import type { TripWithDetails } from '@waylo/shared';
import { JournalTimeline } from './JournalTimeline';
import { HighlightsGallery } from './HighlightsGallery';
import { TripAnalyticsReport } from './TripAnalyticsReport';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { BookOpen, Sparkles, TrendingUp, Compass } from 'lucide-react';

interface JournalAndAnalyticsViewProps {
  trip: TripWithDetails;
}

export function JournalAndAnalyticsView({ trip }: JournalAndAnalyticsViewProps) {
  const [activeSubTab, setActiveSubTab] = useState('journal');

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      <Tabs value={activeSubTab} onValueChange={setActiveSubTab} className="space-y-6">
        <div className="flex items-center justify-between border-b border-border/80 pb-4">
          <TabsList className="bg-muted/60 p-1 rounded-2xl">
            <TabsTrigger value="journal" className="gap-2 rounded-xl text-xs sm:text-sm font-semibold">
              <BookOpen className="h-4 w-4" />
              <span>Daily Journal</span>
            </TabsTrigger>
            <TabsTrigger value="highlights" className="gap-2 rounded-xl text-xs sm:text-sm font-semibold">
              <Sparkles className="h-4 w-4 text-amber-500" />
              <span>Highlights & Gallery</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2 rounded-xl text-xs sm:text-sm font-semibold">
              <TrendingUp className="h-4 w-4 text-indigo-500" />
              <span>Trip Analytics & Report</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="journal" className="space-y-6 focus:outline-none">
          <JournalTimeline trip={trip} />
        </TabsContent>

        <TabsContent value="highlights" className="space-y-6 focus:outline-none">
          <HighlightsGallery trip={trip} />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6 focus:outline-none">
          <TripAnalyticsReport trip={trip} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
