import { Link } from 'react-router-dom';
import { Compass, Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function NotFoundPage() {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center text-center p-6 space-y-6">
      <div className="relative">
        <div className="h-24 w-24 rounded-3xl bg-primary/10 text-primary flex items-center justify-center mx-auto shadow-inner ring-8 ring-primary/5">
          <Compass className="h-12 w-12 animate-spin duration-3000" />
        </div>
        <span className="absolute -bottom-2 -right-2 bg-destructive text-destructive-foreground text-xs font-bold px-2.5 py-0.5 rounded-full">
          404
        </span>
      </div>

      <div className="space-y-2 max-w-md">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Lost off the map?
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Looks like this trailhead doesn’t exist or has moved. Let’s get your coordinates recalibrated and back on the road.
        </p>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <Button variant="outline" onClick={() => window.history.back()} className="rounded-xl gap-2">
          <ArrowLeft className="h-4 w-4" />
          <span>Go Back</span>
        </Button>
        <Button asChild variant="gradient" className="rounded-xl gap-2">
          <Link to="/dashboard">
            <Home className="h-4 w-4" />
            <span>Dashboard</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}
