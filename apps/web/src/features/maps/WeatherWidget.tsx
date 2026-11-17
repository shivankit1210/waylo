import {
  CloudSun,
  Wind,
  Droplets,
  Thermometer,
  ShieldAlert,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { WeatherForecast, DailyWeatherForecast } from '@waylo/shared';

interface WeatherWidgetProps {
  weather?: WeatherForecast;
  className?: string;
}

export function WeatherWidget({ weather, className = '' }: WeatherWidgetProps) {
  if (!weather) return null;

  const { current, daily, locationName } = weather;

  return (
    <Card className={`p-6 rounded-3xl border-border/80 space-y-6 ${className}`}>
      {/* Current Weather Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CloudSun className="h-5 w-5 text-amber-500" />
            <h3 className="font-bold text-lg text-foreground">
              Live Weather & Riding Advisory
            </h3>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Forecast for {locationName || 'Destination'} (via Open-Meteo)
          </p>
        </div>

        {/* Current Temp Pill */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-3xl font-black text-foreground">
              {current.temperatureC}°C
            </div>
            <p className="text-xs font-semibold text-muted-foreground">
              {current.weatherDescription}
            </p>
          </div>

          <div className="flex flex-col gap-1 border-l border-border/60 pl-3 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <Wind className="h-3 w-3 text-sky-500" />
              {current.windSpeedKmH} km/h
            </span>
            <span className="flex items-center gap-1">
              <Thermometer className="h-3 w-3 text-rose-500" />
              Feels good
            </span>
          </div>
        </div>
      </div>

      {/* AI Riding Advisory Banner */}
      {current.ridingAdvisory && (
        <div className="p-3.5 rounded-2xl bg-primary/10 border border-primary/20 flex items-start gap-3">
          <ShieldAlert className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <h4 className="text-xs font-bold text-primary">Travel Copilot Road Advisory</h4>
            <p className="text-xs text-foreground/90 font-medium leading-relaxed">
              {current.ridingAdvisory}
            </p>
          </div>
        </div>
      )}

      {/* 5-Day Multi-Day Forecast Grid */}
      {daily && daily.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            5-Day Route Outlook
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {daily.map((day: DailyWeatherForecast) => {
              const dateObj = new Date(day.date);
              const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
              const monthDay = dateObj.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              });

              return (
                <div
                  key={day.date}
                  className="p-3 rounded-2xl bg-muted/40 border border-border/70 flex flex-col justify-between space-y-2"
                >
                  <div>
                    <span className="font-bold text-xs text-foreground block">{dayName}</span>
                    <span className="text-[10px] text-muted-foreground block">{monthDay}</span>
                  </div>

                  <div className="space-y-1">
                    <div className="text-base font-black text-foreground">
                      {day.tempMaxC}° <span className="text-xs text-muted-foreground font-normal">{day.tempMinC}°</span>
                    </div>
                    <Badge variant="secondary" className="text-[10px] py-0 px-1.5 font-medium truncate max-w-full">
                      {day.weatherDescription}
                    </Badge>
                  </div>

                  {day.precipitationProbability > 0 && (
                    <div className="flex items-center gap-1 text-[10px] font-semibold text-sky-600 dark:text-sky-400">
                      <Droplets className="h-3 w-3 shrink-0" />
                      <span>{day.precipitationProbability}% rain</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </Card>
  );
}
