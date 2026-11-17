import { useState } from 'react';
import type { TripWithDetails, CreateJournalEntryInput, JournalMood } from '@waylo/shared';
import { useJournalEntries, useCreateJournalEntry, useDeleteJournalEntry } from './hooks';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import {
  BookOpen,
  Plus,
  Trash2,
  Calendar,
  CloudSun,
  MapPin,
  Smile,
  Heart,
  Sparkles,
  Image as ImageIcon,
} from 'lucide-react';

interface JournalTimelineProps {
  trip: TripWithDetails;
}

const MOOD_EMOJIS: Record<string, { emoji: string; label: string; color: string }> = {
  EXCELLENT: { emoji: '🤩', label: 'Stoked', color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
  ADVENTUROUS: { emoji: '🔥', label: 'Adventurous', color: 'bg-orange-500/10 text-orange-500 border-orange-500/20' },
  PEACEFUL: { emoji: '🧘', label: 'Peaceful', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
  TIRED: { emoji: '🥱', label: 'Exhausted', color: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
  CHALLENGING: { emoji: '🧗', label: 'Grueling', color: 'bg-purple-500/10 text-purple-500 border-purple-500/20' },
};

export function JournalTimeline({ trip }: JournalTimelineProps) {
  const { data: entries = [], isLoading } = useJournalEntries(trip.id);
  const createEntryMutation = useCreateJournalEntry(trip.id);
  const deleteEntryMutation = useDeleteJournalEntry(trip.id);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dayNumber, setDayNumber] = useState<number | ''>('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [location, setLocation] = useState('');
  const [mood, setMood] = useState<JournalMood>('ADVENTUROUS' as JournalMood);
  const [weatherNote, setWeatherNote] = useState('');
  const [mediaUrlInput, setMediaUrlInput] = useState('');

  const handleCreate = async () => {
    if (!title.trim() || !content.trim()) return;

    const mediaUrls = mediaUrlInput
      .split('\n')
      .map((u) => u.trim())
      .filter((u) => u.length > 0);

    await createEntryMutation.mutateAsync({
      title: title.trim(),
      content: content.trim(),
      dayNumber: dayNumber ? Number(dayNumber) : null,
      location: location.trim() || null,
      mood,
      weatherNote: weatherNote.trim() || null,
      mediaUrls,
    });

    setIsDialogOpen(false);
    setTitle('');
    setContent('');
    setDayNumber('');
    setLocation('');
    setWeatherNote('');
    setMediaUrlInput('');
  };

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Expedition Daily Log & Reflections
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Chronicle your daily stories, rider reflections, mountain encounters, and photo logs.
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} className="gap-2 rounded-xl">
          <Plus className="h-4 w-4" />
          <span>New Journal Entry</span>
        </Button>
      </div>

      {/* Entries List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-48 rounded-3xl bg-muted/40 animate-pulse" />
          ))}
        </div>
      ) : entries.length === 0 ? (
        <Card className="p-8 text-center rounded-3xl border-dashed border-2 border-border/80">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-3">
            <BookOpen className="h-6 w-6" />
          </div>
          <h4 className="font-bold text-foreground mb-1">Your journal is waiting for its first story</h4>
          <p className="text-xs text-muted-foreground max-w-md mx-auto mb-4">
            Record what happened today, roadside fixes, encounters with locals, or personal reflections along the route.
          </p>
          <Button onClick={() => setIsDialogOpen(true)} variant="outline" className="gap-2">
            <Plus className="h-4 w-4" />
            Write Day 1 Log
          </Button>
        </Card>
      ) : (
        <div className="relative pl-6 sm:pl-8 border-l-2 border-primary/20 space-y-8">
          {entries.map((entry) => {
            const moodInfo = entry.mood ? MOOD_EMOJIS[entry.mood] : null;

            return (
              <div key={entry.id} className="relative group">
                {/* Timeline Node Icon */}
                <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 h-6 w-6 rounded-full bg-primary flex items-center justify-center text-white ring-4 ring-background shadow-md">
                  <span className="text-[10px] font-bold">
                    {entry.dayNumber ? `D${entry.dayNumber}` : '★'}
                  </span>
                </div>

                <Card className="p-6 rounded-3xl border-border/80 hover:shadow-md transition-all duration-200 space-y-4">
                  {/* Entry Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-4">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {entry.dayNumber && (
                          <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 font-bold">
                            Day {entry.dayNumber}
                          </Badge>
                        )}
                        <h4 className="text-lg font-bold text-foreground">{entry.title}</h4>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground pt-1">
                        {entry.location && (
                          <span className="flex items-center gap-1 font-medium text-slate-300">
                            <MapPin className="h-3 w-3 text-red-400" />
                            {entry.location}
                          </span>
                        )}
                        {entry.weatherNote && (
                          <span className="flex items-center gap-1 font-medium text-amber-300">
                            <CloudSun className="h-3 w-3" />
                            {entry.weatherNote}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(entry.createdAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-center">
                      {moodInfo && (
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 border ${moodInfo.color}`}
                        >
                          <span>{moodInfo.emoji}</span>
                          <span>{moodInfo.label}</span>
                        </span>
                      )}

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteEntryMutation.mutate(entry.id)}
                        className="h-8 w-8 text-muted-foreground hover:text-red-400 opacity-60 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Entry Content */}
                  <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
                    {entry.content}
                  </p>

                  {/* Media Gallery Grid */}
                  {entry.mediaUrls && entry.mediaUrls.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                      {entry.mediaUrls.map((url, idx) => (
                        <div
                          key={idx}
                          className="relative h-36 rounded-2xl overflow-hidden bg-slate-900 border border-border/80 group/photo"
                        >
                          <img
                            src={url}
                            alt={`Photo ${idx + 1}`}
                            className="w-full h-full object-cover group-hover/photo:scale-105 transition-transform duration-300"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Author Attribution */}
                  {entry.author && (
                    <div className="flex items-center gap-2 pt-2 text-xs text-muted-foreground">
                      <div className="h-5 w-5 rounded-full overflow-hidden bg-muted">
                        {entry.author.avatarUrl ? (
                          <img
                            src={entry.author.avatarUrl}
                            alt={entry.author.displayName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-bold text-[9px]">
                            {entry.author.displayName[0]}
                          </div>
                        )}
                      </div>
                      <span>Logged by {entry.author.displayName}</span>
                    </div>
                  )}
                </Card>
              </div>
            );
          })}
        </div>
      )}

      {/* New Entry Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Daily Journal Log</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">
                  Day Number
                </label>
                <Input
                  type="number"
                  placeholder="e.g. 1"
                  min={1}
                  value={dayNumber}
                  onChange={(e) => setDayNumber(e.target.value === '' ? '' : Number(e.target.value))}
                />
              </div>

              <div className="col-span-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">
                  Mood & Spirit
                </label>
                <select
                  value={mood}
                  onChange={(e) => setMood(e.target.value as JournalMood)}
                  className="w-full px-3 py-2 rounded-xl border border-input bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="ADVENTUROUS">🔥 Adventurous & Hyped</option>
                  <option value="EXCELLENT">🤩 Stoked & Unstoppable</option>
                  <option value="PEACEFUL">🧘 Peaceful & Serene</option>
                  <option value="TIRED">🥱 Exhausted but Victorious</option>
                  <option value="CHALLENGING">🧗 Grueling & Tested</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">
                Story Title *
              </label>
              <Input
                placeholder="e.g. Crossing the High Passes into Nubra"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">
                  Location / Checkpoint
                </label>
                <Input
                  placeholder="e.g. Khardung La Top"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">
                  Weather Note
                </label>
                <Input
                  placeholder="e.g. 8°C, Clear mountain sunshine"
                  value={weatherNote}
                  onChange={(e) => setWeatherNote(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">
                Reflections & Road Notes *
              </label>
              <textarea
                rows={4}
                placeholder="What occurred today? How did the convoy hold up? What was the ride like?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary leading-relaxed"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">
                Photo URLs (one per line)
              </label>
              <textarea
                rows={2}
                placeholder="https://images.unsplash.com/photo-1...&#10;https://images.unsplash.com/photo-2..."
                value={mediaUrlInput}
                onChange={(e) => setMediaUrlInput(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-input bg-background text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={!title.trim() || !content.trim() || createEntryMutation.isPending}
            >
              Save Memory
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
