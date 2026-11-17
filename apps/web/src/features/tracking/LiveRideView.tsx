import { useState } from 'react';
import {
  Radio,
  Navigation,
  Send,
  Users,
  Battery,
  Zap,
  Play,
  Square,
  AlertTriangle,
  Clock,
  Sparkles,
  MapPin,
  Flame,
  ShieldAlert,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GroupRideMap } from './GroupRideMap';
import { CrewPingDialog } from './CrewPingDialog';
import {
  useRideSession,
  useStartRideSession,
  useEndRideSession,
  useSendCrewPing,
  useLiveTrackingWebSocket,
} from './hooks';
import { PingType, RideSessionStatus, type TripWithDetails, type RiderLocation } from '@waylo/shared';

interface LiveRideViewProps {
  trip: TripWithDetails | any;
}

export function LiveRideView({ trip }: LiveRideViewProps) {
  const { data: session, isLoading: sessionLoading } = useRideSession(trip?.id);
  const startSessionMutation = useStartRideSession(trip?.id);
  const endSessionMutation = useEndRideSession(trip?.id);
  const sendPingMutation = useSendCrewPing(trip?.id);

  const [isPingDialogOpen, setIsPingDialogOpen] = useState(false);

  // Fallback center coordinates (Goa default)
  const centerCoords: [number, number] = [15.2993, 74.124];

  const {
    isConnected,
    riders: liveRiders,
    recentPings,
    isBroadcasting,
    isSimulating,
    sendCrewPing,
    startGpsBroadcast,
    stopGpsBroadcast,
    startSimulation,
    stopSimulation,
  } = useLiveTrackingWebSocket(trip?.id, centerCoords);

  // Combine live riders with sample convoy companions if convoy is lonely
  const displayRiders: RiderLocation[] =
    liveRiders.length > 0
      ? liveRiders
      : [
          {
            userId: 'rider-demo-lead',
            displayName: 'Rohan Sharma (Lead)',
            avatarUrl: null,
            latitude: centerCoords[0] + 0.005,
            longitude: centerCoords[1] + 0.008,
            speedKmh: 64,
            headingDeg: 120,
            batteryPercent: 91,
            isMoving: true,
            lastPingAt: new Date().toISOString(),
          },
          {
            userId: 'rider-demo-mid',
            displayName: 'Vikram Mehta',
            avatarUrl: null,
            latitude: centerCoords[0] + 0.002,
            longitude: centerCoords[1] + 0.004,
            speedKmh: 58,
            headingDeg: 118,
            batteryPercent: 76,
            isMoving: true,
            lastPingAt: new Date().toISOString(),
          },
          {
            userId: 'rider-demo-sweep',
            displayName: 'Priya Iyer (Sweep)',
            avatarUrl: null,
            latitude: centerCoords[0] - 0.003,
            longitude: centerCoords[1] - 0.002,
            speedKmh: 0,
            headingDeg: 90,
            batteryPercent: 64,
            isMoving: false,
            lastPingAt: new Date(Date.now() - 60000).toISOString(),
          },
        ];

  const isSessionActive = session?.status === RideSessionStatus.ACTIVE || isBroadcasting;

  const handleToggleBroadcast = () => {
    if (isBroadcasting) {
      if (isSimulating) {
        stopSimulation();
      } else {
        stopGpsBroadcast();
      }
    } else {
      // Prompt GPS or simulation
      startSimulation();
    }
  };

  const handleSendPing = (type: PingType, message?: string) => {
    sendCrewPing(type, message);
    sendPingMutation.mutate({ pingType: type, message });
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      {/* Top Session Telemetry Header Card */}
      <Card className="p-6 rounded-3xl border-border/80 bg-gradient-to-br from-card via-card to-blue-500/5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <Badge
                variant="outline"
                className={`font-bold text-xs uppercase tracking-wider py-1 px-3 ${
                  isSessionActive
                    ? 'border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10'
                    : 'border-muted text-muted-foreground'
                }`}
              >
                <Radio
                  className={`h-3.5 w-3.5 mr-1.5 inline ${
                    isSessionActive ? 'text-emerald-500 animate-pulse' : 'text-muted-foreground'
                  }`}
                />
                {isSessionActive ? 'Convoy Tracking Active' : 'Convoy Standby'}
              </Badge>

              <span className="text-xs text-muted-foreground font-medium">
                {isConnected ? '🛰️ Connected to Realtime Mesh' : '📡 Offline Mode (Local Relay)'}
              </span>
            </div>

            <h3 className="text-2xl font-black text-foreground tracking-tight">
              {trip?.name || 'Group Ride'} Live Telemetry
            </h3>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant={isBroadcasting ? 'destructive' : 'default'}
              size="sm"
              onClick={handleToggleBroadcast}
              className="rounded-xl font-bold text-xs gap-1.5 shadow-sm"
            >
              {isBroadcasting ? (
                <>
                  <Square className="h-3.5 w-3.5" />
                  <span>Stop Broadcasting</span>
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5" />
                  <span>Broadcast My Ride (Sim)</span>
                </>
              )}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={startGpsBroadcast}
              disabled={isBroadcasting && !isSimulating}
              className="rounded-xl font-bold text-xs gap-1.5"
            >
              <Navigation className="h-3.5 w-3.5 text-primary" />
              <span>Use Real GPS</span>
            </Button>

            <Button
              variant="destructive"
              size="sm"
              onClick={() => setIsPingDialogOpen(true)}
              className="rounded-xl font-bold text-xs gap-1.5 bg-red-600 hover:bg-red-700 shadow-md shadow-red-500/20"
            >
              <ShieldAlert className="h-3.5 w-3.5" />
              <span>Transmit Ping / SOS</span>
            </Button>
          </div>
        </div>

        {/* Status Indicators Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-border/60 text-xs">
          <div>
            <span className="text-muted-foreground font-semibold block mb-0.5">Connected Crew</span>
            <span className="font-bold text-foreground text-sm flex items-center gap-1.5">
              <Users className="h-4 w-4 text-primary" />
              {displayRiders.length} Riders Active
            </span>
          </div>

          <div>
            <span className="text-muted-foreground font-semibold block mb-0.5">Average Speed</span>
            <span className="font-bold text-foreground text-sm">
              {Math.round(
                displayRiders.reduce((acc, r) => acc + (r.speedKmh || 0), 0) /
                  (displayRiders.length || 1)
              )}{' '}
              km/h
            </span>
          </div>

          <div>
            <span className="text-muted-foreground font-semibold block mb-0.5">Convoy Spread</span>
            <span className="font-bold text-foreground text-sm">~1.2 km Turnout Gap</span>
          </div>

          <div>
            <span className="text-muted-foreground font-semibold block mb-0.5">Telemetry Mode</span>
            <span className="font-bold text-foreground text-sm">
              {isSimulating ? 'Simulated Cruising' : isBroadcasting ? 'Live GPS Satellites' : 'Standby'}
            </span>
          </div>
        </div>
      </Card>

      {/* Main Grid: Live Map + Crew Roster & Alert Feed */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Map Container (8 Cols) */}
        <div className="lg:col-span-8">
          <GroupRideMap
            riders={displayRiders}
            recentPings={recentPings}
            center={centerCoords}
            zoom={13}
            className="h-[520px]"
          />
        </div>

        {/* Side Panel: Crew Roster & Pings (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Active Riders Roster Card */}
          <Card className="p-5 rounded-3xl border-border/80 space-y-4 bg-card/90 shadow-sm">
            <div className="flex items-center justify-between pb-2 border-b border-border/60">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <h4 className="font-bold text-sm text-foreground">Convoy Roster</h4>
              </div>
              <Badge variant="secondary" className="text-[10px] font-bold">
                {displayRiders.length} Active
              </Badge>
            </div>

            <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
              {displayRiders.map((rider) => {
                const isMoving = rider.isMoving && (rider.speedKmh || 0) > 3;
                return (
                  <div
                    key={rider.userId}
                    className="p-2.5 rounded-2xl border border-border/70 bg-card hover:border-primary/40 transition-colors flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`h-8 w-8 rounded-full ${
                          isMoving
                            ? 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white'
                            : 'bg-muted text-foreground'
                        } flex items-center justify-center font-black text-xs shrink-0`}
                      >
                        {rider.displayName.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-xs text-foreground leading-tight">
                          {rider.displayName}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          {isMoving ? (
                            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                              Cruising • {rider.speedKmh} km/h
                            </span>
                          ) : (
                            <span>Stationary / Stopped</span>
                          )}
                        </p>
                      </div>
                    </div>

                    {rider.batteryPercent !== null && rider.batteryPercent !== undefined && (
                      <div className="flex items-center gap-1 text-[11px] font-bold text-muted-foreground">
                        <Battery className="h-3.5 w-3.5 text-emerald-500" />
                        <span>{rider.batteryPercent}%</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Recent Alert Beacons Feed */}
          <Card className="p-5 rounded-3xl border-border/80 space-y-4 bg-card/90 shadow-sm">
            <div className="flex items-center justify-between pb-2 border-b border-border/60">
              <div className="flex items-center gap-2">
                <Radio className="h-4 w-4 text-amber-500" />
                <h4 className="font-bold text-sm text-foreground">Live Alert Feed</h4>
              </div>
              <button
                type="button"
                onClick={() => setIsPingDialogOpen(true)}
                className="text-xs font-bold text-primary hover:underline"
              >
                + Ping
              </button>
            </div>

            <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
              {recentPings.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground space-y-1">
                  <p className="text-xs font-semibold">No active pings</p>
                  <p className="text-[10px]">Tap "+ Ping" to broadcast turnouts, fuel stops, or SOS.</p>
                </div>
              ) : (
                recentPings.map((ping) => {
                  const isSOS = ping.pingType === PingType.SOS_EMERGENCY;
                  return (
                    <div
                      key={ping.id}
                      className={`p-3 rounded-2xl border text-xs space-y-1 ${
                        isSOS
                          ? 'border-red-500/50 bg-red-500/10 text-red-700 dark:text-red-300'
                          : 'border-border/70 bg-card/80 text-foreground'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[11px] uppercase tracking-wide">
                          {isSOS ? '🚨 SOS EMERGENCY' : ping.pingType.replace(/_/g, ' ')}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(ping.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <p className="text-xs font-medium">{ping.message}</p>
                      <p className="text-[10px] text-muted-foreground">From: {ping.senderName}</p>
                    </div>
                  );
                })
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Crew Ping Modal */}
      <CrewPingDialog
        open={isPingDialogOpen}
        onOpenChange={setIsPingDialogOpen}
        onSendPing={handleSendPing}
        isLoading={sendPingMutation.isPending}
      />
    </div>
  );
}
