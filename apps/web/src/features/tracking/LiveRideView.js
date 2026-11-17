import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { Radio, Navigation, Users, Battery, Play, Square, ShieldAlert, } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GroupRideMap } from './GroupRideMap';
import { CrewPingDialog } from './CrewPingDialog';
import { useRideSession, useStartRideSession, useEndRideSession, useSendCrewPing, useLiveTrackingWebSocket, } from './hooks';
import { PingType, RideSessionStatus } from '@waylo/shared';
export function LiveRideView({ trip }) {
    const { data: session, isLoading: sessionLoading } = useRideSession(trip?.id);
    const startSessionMutation = useStartRideSession(trip?.id);
    const endSessionMutation = useEndRideSession(trip?.id);
    const sendPingMutation = useSendCrewPing(trip?.id);
    const [isPingDialogOpen, setIsPingDialogOpen] = useState(false);
    // Fallback center coordinates (Goa default)
    const centerCoords = [15.2993, 74.124];
    const { isConnected, riders: liveRiders, recentPings, isBroadcasting, isSimulating, sendCrewPing, startGpsBroadcast, stopGpsBroadcast, startSimulation, stopSimulation, } = useLiveTrackingWebSocket(trip?.id, centerCoords);
    // Combine live riders with sample convoy companions if convoy is lonely
    const displayRiders = liveRiders.length > 0
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
            }
            else {
                stopGpsBroadcast();
            }
        }
        else {
            // Prompt GPS or simulation
            startSimulation();
        }
    };
    const handleSendPing = (type, message) => {
        sendCrewPing(type, message);
        sendPingMutation.mutate({ pingType: type, message });
    };
    return (_jsxs("div", { className: "space-y-6 animate-in fade-in-50 duration-300", children: [_jsxs(Card, { className: "p-6 rounded-3xl border-border/80 bg-gradient-to-br from-card via-card to-blue-500/5 shadow-sm space-y-4", children: [_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4", children: [_jsxs("div", { className: "space-y-1", children: [_jsxs("div", { className: "flex items-center gap-2.5", children: [_jsxs(Badge, { variant: "outline", className: `font-bold text-xs uppercase tracking-wider py-1 px-3 ${isSessionActive
                                                    ? 'border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10'
                                                    : 'border-muted text-muted-foreground'}`, children: [_jsx(Radio, { className: `h-3.5 w-3.5 mr-1.5 inline ${isSessionActive ? 'text-emerald-500 animate-pulse' : 'text-muted-foreground'}` }), isSessionActive ? 'Convoy Tracking Active' : 'Convoy Standby'] }), _jsx("span", { className: "text-xs text-muted-foreground font-medium", children: isConnected ? '🛰️ Connected to Realtime Mesh' : '📡 Offline Mode (Local Relay)' })] }), _jsxs("h3", { className: "text-2xl font-black text-foreground tracking-tight", children: [trip?.name || 'Group Ride', " Live Telemetry"] })] }), _jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [_jsx(Button, { variant: isBroadcasting ? 'destructive' : 'default', size: "sm", onClick: handleToggleBroadcast, className: "rounded-xl font-bold text-xs gap-1.5 shadow-sm", children: isBroadcasting ? (_jsxs(_Fragment, { children: [_jsx(Square, { className: "h-3.5 w-3.5" }), _jsx("span", { children: "Stop Broadcasting" })] })) : (_jsxs(_Fragment, { children: [_jsx(Play, { className: "h-3.5 w-3.5" }), _jsx("span", { children: "Broadcast My Ride (Sim)" })] })) }), _jsxs(Button, { variant: "outline", size: "sm", onClick: startGpsBroadcast, disabled: isBroadcasting && !isSimulating, className: "rounded-xl font-bold text-xs gap-1.5", children: [_jsx(Navigation, { className: "h-3.5 w-3.5 text-primary" }), _jsx("span", { children: "Use Real GPS" })] }), _jsxs(Button, { variant: "destructive", size: "sm", onClick: () => setIsPingDialogOpen(true), className: "rounded-xl font-bold text-xs gap-1.5 bg-red-600 hover:bg-red-700 shadow-md shadow-red-500/20", children: [_jsx(ShieldAlert, { className: "h-3.5 w-3.5" }), _jsx("span", { children: "Transmit Ping / SOS" })] })] })] }), _jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-border/60 text-xs", children: [_jsxs("div", { children: [_jsx("span", { className: "text-muted-foreground font-semibold block mb-0.5", children: "Connected Crew" }), _jsxs("span", { className: "font-bold text-foreground text-sm flex items-center gap-1.5", children: [_jsx(Users, { className: "h-4 w-4 text-primary" }), displayRiders.length, " Riders Active"] })] }), _jsxs("div", { children: [_jsx("span", { className: "text-muted-foreground font-semibold block mb-0.5", children: "Average Speed" }), _jsxs("span", { className: "font-bold text-foreground text-sm", children: [Math.round(displayRiders.reduce((acc, r) => acc + (r.speedKmh || 0), 0) /
                                                (displayRiders.length || 1)), ' ', "km/h"] })] }), _jsxs("div", { children: [_jsx("span", { className: "text-muted-foreground font-semibold block mb-0.5", children: "Convoy Spread" }), _jsx("span", { className: "font-bold text-foreground text-sm", children: "~1.2 km Turnout Gap" })] }), _jsxs("div", { children: [_jsx("span", { className: "text-muted-foreground font-semibold block mb-0.5", children: "Telemetry Mode" }), _jsx("span", { className: "font-bold text-foreground text-sm", children: isSimulating ? 'Simulated Cruising' : isBroadcasting ? 'Live GPS Satellites' : 'Standby' })] })] })] }), _jsxs("div", { className: "grid lg:grid-cols-12 gap-6", children: [_jsx("div", { className: "lg:col-span-8", children: _jsx(GroupRideMap, { riders: displayRiders, recentPings: recentPings, center: centerCoords, zoom: 13, className: "h-[520px]" }) }), _jsxs("div", { className: "lg:col-span-4 space-y-6", children: [_jsxs(Card, { className: "p-5 rounded-3xl border-border/80 space-y-4 bg-card/90 shadow-sm", children: [_jsxs("div", { className: "flex items-center justify-between pb-2 border-b border-border/60", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Users, { className: "h-4 w-4 text-primary" }), _jsx("h4", { className: "font-bold text-sm text-foreground", children: "Convoy Roster" })] }), _jsxs(Badge, { variant: "secondary", className: "text-[10px] font-bold", children: [displayRiders.length, " Active"] })] }), _jsx("div", { className: "space-y-3 max-h-[220px] overflow-y-auto pr-1", children: displayRiders.map((rider) => {
                                            const isMoving = rider.isMoving && (rider.speedKmh || 0) > 3;
                                            return (_jsxs("div", { className: "p-2.5 rounded-2xl border border-border/70 bg-card hover:border-primary/40 transition-colors flex items-center justify-between gap-3", children: [_jsxs("div", { className: "flex items-center gap-2.5", children: [_jsx("div", { className: `h-8 w-8 rounded-full ${isMoving
                                                                    ? 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white'
                                                                    : 'bg-muted text-foreground'} flex items-center justify-center font-black text-xs shrink-0`, children: rider.displayName.slice(0, 2).toUpperCase() }), _jsxs("div", { children: [_jsx("p", { className: "font-bold text-xs text-foreground leading-tight", children: rider.displayName }), _jsx("p", { className: "text-[10px] text-muted-foreground mt-0.5", children: isMoving ? (_jsxs("span", { className: "text-emerald-600 dark:text-emerald-400 font-semibold", children: ["Cruising \u2022 ", rider.speedKmh, " km/h"] })) : (_jsx("span", { children: "Stationary / Stopped" })) })] })] }), rider.batteryPercent !== null && rider.batteryPercent !== undefined && (_jsxs("div", { className: "flex items-center gap-1 text-[11px] font-bold text-muted-foreground", children: [_jsx(Battery, { className: "h-3.5 w-3.5 text-emerald-500" }), _jsxs("span", { children: [rider.batteryPercent, "%"] })] }))] }, rider.userId));
                                        }) })] }), _jsxs(Card, { className: "p-5 rounded-3xl border-border/80 space-y-4 bg-card/90 shadow-sm", children: [_jsxs("div", { className: "flex items-center justify-between pb-2 border-b border-border/60", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Radio, { className: "h-4 w-4 text-amber-500" }), _jsx("h4", { className: "font-bold text-sm text-foreground", children: "Live Alert Feed" })] }), _jsx("button", { type: "button", onClick: () => setIsPingDialogOpen(true), className: "text-xs font-bold text-primary hover:underline", children: "+ Ping" })] }), _jsx("div", { className: "space-y-2.5 max-h-[220px] overflow-y-auto pr-1", children: recentPings.length === 0 ? (_jsxs("div", { className: "text-center py-6 text-muted-foreground space-y-1", children: [_jsx("p", { className: "text-xs font-semibold", children: "No active pings" }), _jsx("p", { className: "text-[10px]", children: "Tap \"+ Ping\" to broadcast turnouts, fuel stops, or SOS." })] })) : (recentPings.map((ping) => {
                                            const isSOS = ping.pingType === PingType.SOS_EMERGENCY;
                                            return (_jsxs("div", { className: `p-3 rounded-2xl border text-xs space-y-1 ${isSOS
                                                    ? 'border-red-500/50 bg-red-500/10 text-red-700 dark:text-red-300'
                                                    : 'border-border/70 bg-card/80 text-foreground'}`, children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "font-bold text-[11px] uppercase tracking-wide", children: isSOS ? '🚨 SOS EMERGENCY' : ping.pingType.replace(/_/g, ' ') }), _jsx("span", { className: "text-[10px] text-muted-foreground", children: new Date(ping.createdAt).toLocaleTimeString([], {
                                                                    hour: '2-digit',
                                                                    minute: '2-digit',
                                                                }) })] }), _jsx("p", { className: "text-xs font-medium", children: ping.message }), _jsxs("p", { className: "text-[10px] text-muted-foreground", children: ["From: ", ping.senderName] })] }, ping.id));
                                        })) })] })] })] }), _jsx(CrewPingDialog, { open: isPingDialogOpen, onOpenChange: setIsPingDialogOpen, onSendPing: handleSendPing, isLoading: sendPingMutation.isPending })] }));
}
//# sourceMappingURL=LiveRideView.js.map