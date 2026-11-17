import { useState } from 'react';
import type { TripWithDetails, CreateTripHighlightInput, HighlightCategory } from '@waylo/shared';
import { useTripHighlights, useCreateTripHighlight, useDeleteTripHighlight } from './hooks';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Star, Plus, Trash2, MapPin, Sparkles, Image, Compass, Flame } from 'lucide-react';

interface HighlightsGalleryProps {
  trip: TripWithDetails;
}

const CATEGORY_ICONS: Record<string, string> = {
  SCENIC_VIEW: '🏔️',
  FOOD_SPOT: '🍜',
  EPIC_RIDE: '🏍️',
  CULTURE: '🛕',
  SUNSET: '🌅',
  WILDLIFE: '🦅',
  OTHER: '⭐',
};

export function HighlightsGallery({ trip }: HighlightsGalleryProps) {
  const { data: highlights = [], isLoading } = useTripHighlights(trip.id);
  const createHighlightMutation = useCreateTripHighlight(trip.id);
  const deleteHighlightMutation = useDeleteTripHighlight(trip.id);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<HighlightCategory>('SCENIC_VIEW' as HighlightCategory);
  const [location, setLocation] = useState('');
  const [rating, setRating] = useState(5);
  const [photoUrl, setPhotoUrl] = useState('');

  const handleCreate = async () => {
    if (!title.trim()) return;

    await createHighlightMutation.mutateAsync({
      title: title.trim(),
      description: description.trim() || null,
      category,
      location: location.trim() || null,
      rating,
      photoUrl: photoUrl.trim() || null,
    });

    setIsDialogOpen(false);
    setTitle('');
    setDescription('');
    setLocation('');
    setPhotoUrl('');
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-500" />
            Trip Highlights & Hall of Fame
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Pin the most unforgettable passes, viewpoints, scenic bends, and food joints from this journey.
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} className="gap-2 rounded-xl">
          <Plus className="h-4 w-4" />
          <span>Add Highlight</span>
        </Button>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 rounded-2xl bg-muted/40 animate-pulse" />
          ))}
        </div>
      ) : highlights.length === 0 ? (
        <Card className="p-8 text-center rounded-3xl border-dashed border-2 border-border/80">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 mb-3">
            <Star className="h-6 w-6" />
          </div>
          <h4 className="font-bold text-foreground mb-1">No highlights pinned yet</h4>
          <p className="text-xs text-muted-foreground max-w-md mx-auto mb-4">
            Did you conquer an unforgettable pass or discover an incredible roadside café? Add it to the highlights hall of fame!
          </p>
          <Button onClick={() => setIsDialogOpen(true)} variant="outline" className="gap-2">
            <Plus className="h-4 w-4" />
            Add First Highlight
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {highlights.map((hl) => (
            <Card
              key={hl.id}
              className="group overflow-hidden rounded-3xl border-border/70 hover:border-border hover:shadow-lg transition-all duration-300 flex flex-col"
            >
              <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
                {hl.photoUrl ? (
                  <img
                    src={hl.photoUrl}
                    alt={hl.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-slate-400">
                    <Compass className="h-10 w-10 opacity-30 mb-1" />
                    <span className="text-xs font-medium">Waylo Memory</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-xs font-semibold text-white flex items-center gap-1.5 border border-white/10">
                  <span>{CATEGORY_ICONS[hl.category] || '⭐'}</span>
                  <span className="capitalize">{hl.category.replace(/_/g, ' ').toLowerCase()}</span>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteHighlightMutation.mutate(hl.id)}
                  className="absolute top-3 right-3 h-8 w-8 rounded-full bg-black/50 backdrop-blur-md text-white/70 hover:text-red-400 hover:bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3.5 w-3.5 ${
                          i < hl.rating ? 'text-amber-400 fill-amber-400' : 'text-white/30'
                        }`}
                      />
                    ))}
                  </div>
                  {hl.location && (
                    <span className="text-xs text-white/80 flex items-center gap-1 font-medium truncate max-w-[50%]">
                      <MapPin className="h-3 w-3 text-red-400 flex-shrink-0" />
                      <span className="truncate">{hl.location}</span>
                    </span>
                  )}
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <h4 className="font-bold text-base text-foreground leading-snug">{hl.title}</h4>
                  {hl.description && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-3 leading-relaxed">
                      {hl.description}
                    </p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Pin Trip Highlight</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">
                Highlight Title *
              </label>
              <Input
                placeholder="e.g. Khardung La 17,982 ft Summit"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as HighlightCategory)}
                  className="w-full px-3 py-2 rounded-xl border border-input bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="SCENIC_VIEW">Scenic Viewpoint</option>
                  <option value="EPIC_RIDE">Epic Ride / Pass</option>
                  <option value="FOOD_SPOT">Food & Café Stop</option>
                  <option value="SUNSET">Sunset / Sunrise</option>
                  <option value="CULTURE">Culture & Heritage</option>
                  <option value="WILDLIFE">Wildlife Spotting</option>
                  <option value="OTHER">Other Memory</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">
                  Rating (1-5)
                </label>
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-input bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value={5}>⭐⭐⭐⭐⭐ (5 - Legendary)</option>
                  <option value={4}>⭐⭐⭐⭐ (4 - Awesome)</option>
                  <option value={3}>⭐⭐⭐ (3 - Good)</option>
                  <option value={2}>⭐⭐ (2 - Fair)</option>
                  <option value={1}>⭐ (1 - Skip)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">
                Location Name
              </label>
              <Input
                placeholder="e.g. Ladakh Highway, KM 48"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">
                Photo URL (optional)
              </label>
              <Input
                placeholder="https://images.unsplash.com/..."
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">
                Notes & Memories
              </label>
              <textarea
                rows={3}
                placeholder="What made this moment unforgettable?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={!title.trim() || createHighlightMutation.isPending}
            >
              Pin Highlight
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
