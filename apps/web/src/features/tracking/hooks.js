import { useState, useEffect, useRef, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { trackingApi } from './api';
import { useAuthStore } from '@/stores/authStore';
import { toast } from 'sonner';
import { PingType, } from '@waylo/shared';
export function useRideSession(tripId) {
    return useQuery({
        queryKey: ['tracking-session', tripId],
        queryFn: () => (tripId ? trackingApi.getSession(tripId) : null),
        enabled: Boolean(tripId),
        refetchInterval: 15000,
    });
}
export function useRiders(tripId) {
    return useQuery({
        queryKey: ['tracking-riders', tripId],
        queryFn: () => (tripId ? trackingApi.getRiders(tripId) : []),
        enabled: Boolean(tripId),
        refetchInterval: 10000,
    });
}
export function useCrewPings(tripId) {
    return useQuery({
        queryKey: ['tracking-pings', tripId],
        queryFn: () => (tripId ? trackingApi.getPings(tripId) : []),
        enabled: Boolean(tripId),
        refetchInterval: 10000,
    });
}
export function useStartRideSession(tripId) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => {
            if (!tripId)
                throw new Error('Trip ID is required');
            return trackingApi.startSession(tripId, data);
        },
        onSuccess: () => {
            toast.success('Live Convoy session launched!');
            queryClient.invalidateQueries({ queryKey: ['tracking-session', tripId] });
        },
    });
}
export function useEndRideSession(tripId) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => {
            if (!tripId)
                throw new Error('Trip ID is required');
            return trackingApi.endSession(tripId);
        },
        onSuccess: () => {
            toast.info('Live Convoy session paused/ended');
            queryClient.invalidateQueries({ queryKey: ['tracking-session', tripId] });
        },
    });
}
export function useSendCrewPing(tripId) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => {
            if (!tripId)
                throw new Error('Trip ID is required');
            return trackingApi.sendPing(tripId, data);
        },
        onSuccess: (alert) => {
            toast.success(`Beacon sent: ${alert.senderName} (${alert.pingType})`);
            queryClient.invalidateQueries({ queryKey: ['tracking-pings', tripId] });
        },
    });
}
/**
 * Real-time WebSocket hook for group ride telemetry and pings
 */
export function useLiveTrackingWebSocket(tripId, initialCenter) {
    const { user } = useAuthStore();
    const token = useAuthStore.getState().getToken();
    const [isConnected, setIsConnected] = useState(false);
    const [riders, setRiders] = useState([]);
    const [recentPings, setRecentPings] = useState([]);
    const [isBroadcasting, setIsBroadcasting] = useState(false);
    const [isSimulating, setIsSimulating] = useState(false);
    const socketRef = useRef(null);
    const simTimerRef = useRef(null);
    const geoWatchIdRef = useRef(null);
    // Fallback initial coordinates (Goa default if not provided)
    const baseLat = initialCenter ? initialCenter[0] : 15.2993;
    const baseLng = initialCenter ? initialCenter[1] : 74.124;
    const currentCoordsRef = useRef({
        lat: baseLat,
        lng: baseLng,
    });
    // Connect WebSocket
    useEffect(() => {
        if (!tripId || !token)
            return;
        let wsUrl = 'ws://localhost:3001/ws/live';
        if (typeof window !== 'undefined') {
            const isHttps = window.location.protocol === 'https:';
            const host = window.location.hostname;
            // In development, backend runs on port 3001
            const port = '3001';
            wsUrl = `${isHttps ? 'wss:' : 'ws:'}//${host}:${port}/ws/live`;
        }
        let ws;
        try {
            ws = new WebSocket(wsUrl);
            socketRef.current = ws;
            ws.onopen = () => {
                setIsConnected(true);
                // Send join event
                const joinEvent = {
                    type: 'JOIN_TRIP',
                    payload: { tripId, token },
                };
                ws.send(JSON.stringify(joinEvent));
            };
            ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    switch (data.type) {
                        case 'RIDER_LOCATIONS_SNAPSHOT':
                            setRiders(data.payload.riders);
                            break;
                        case 'RIDER_LOCATION_UPDATED': {
                            const updated = data.payload.rider;
                            setRiders((prev) => {
                                const idx = prev.findIndex((r) => r.userId === updated.userId);
                                if (idx !== -1) {
                                    const copy = [...prev];
                                    copy[idx] = updated;
                                    return copy;
                                }
                                return [...prev, updated];
                            });
                            break;
                        }
                        case 'RIDER_JOINED':
                            toast.info(`${data.payload.displayName} joined the convoy!`);
                            break;
                        case 'RIDER_LEFT':
                            setRiders((prev) => prev.filter((r) => r.userId !== data.payload.userId));
                            break;
                        case 'CREW_PING': {
                            const alert = data.payload.alert;
                            setRecentPings((prev) => [alert, ...prev.slice(0, 20)]);
                            if (alert.pingType === PingType.SOS_EMERGENCY) {
                                toast.error(`🚨 SOS ALERT: ${alert.senderName} activated emergency beacon!`, {
                                    duration: 8000,
                                });
                            }
                            else {
                                toast.info(`🔔 Crew Beacon: ${alert.senderName} - ${alert.message}`);
                            }
                            break;
                        }
                    }
                }
                catch (err) {
                    console.warn('Failed to parse WebSocket event:', err);
                }
            };
            ws.onclose = () => {
                setIsConnected(false);
            };
            ws.onerror = () => {
                setIsConnected(false);
            };
        }
        catch (err) {
            console.warn('WebSocket connection failed:', err);
        }
        return () => {
            if (ws) {
                ws.close();
            }
            socketRef.current = null;
        };
    }, [tripId, token]);
    // Send Location helper
    const sendLocation = useCallback((coords) => {
        if (!tripId)
            return;
        currentCoordsRef.current = { lat: coords.latitude, lng: coords.longitude };
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            const event = {
                type: 'UPDATE_LOCATION',
                payload: {
                    tripId,
                    ...coords,
                },
            };
            socketRef.current.send(JSON.stringify(event));
        }
        else {
            // Fallback to HTTP
            trackingApi.updateLocation(tripId, coords).catch(() => { });
        }
    }, [tripId]);
    // Send Crew Ping helper
    const sendCrewPing = useCallback((pingType, message, customCoords) => {
        if (!tripId)
            return;
        const lat = customCoords?.lat ?? currentCoordsRef.current.lat;
        const lng = customCoords?.lng ?? currentCoordsRef.current.lng;
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            const event = {
                type: 'SEND_PING',
                payload: {
                    tripId,
                    pingType,
                    message,
                    latitude: lat,
                    longitude: lng,
                },
            };
            socketRef.current.send(JSON.stringify(event));
        }
        else {
            trackingApi.sendPing(tripId, { pingType, message, latitude: lat, longitude: lng }).catch(() => { });
        }
    }, [tripId]);
    // Start Real Device GPS Broadcasting
    const startGpsBroadcast = useCallback(() => {
        if (!navigator.geolocation) {
            toast.error('Geolocation is not supported by your browser');
            return;
        }
        setIsBroadcasting(true);
        setIsSimulating(false);
        geoWatchIdRef.current = navigator.geolocation.watchPosition((pos) => {
            const speedKmh = pos.coords.speed ? Math.round(pos.coords.speed * 3.6) : 0;
            sendLocation({
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude,
                altitude: pos.coords.altitude ? Math.round(pos.coords.altitude) : undefined,
                speedKmh,
                headingDeg: pos.coords.heading ? Math.round(pos.coords.heading) : 0,
                batteryPercent: 88,
            });
        }, (err) => {
            console.warn('Geolocation watch error:', err);
            toast.error('Unable to fetch live GPS fix. You can try Simulation Mode.');
        }, {
            enableHighAccuracy: true,
            maximumAge: 5000,
            timeout: 10000,
        });
    }, [sendLocation]);
    // Stop GPS Broadcasting
    const stopGpsBroadcast = useCallback(() => {
        if (geoWatchIdRef.current !== null) {
            navigator.geolocation.clearWatch(geoWatchIdRef.current);
            geoWatchIdRef.current = null;
        }
        setIsBroadcasting(false);
    }, []);
    // Convoy Cruising Simulation Mode
    const startSimulation = useCallback(() => {
        stopGpsBroadcast();
        setIsSimulating(true);
        setIsBroadcasting(true);
        let angle = 0;
        let currentSpeed = 55;
        simTimerRef.current = setInterval(() => {
            angle += 0.08;
            // Gentle circular ride loop around base coordinates
            const radius = 0.015; // ~1.5 km
            const newLat = baseLat + Math.sin(angle) * radius;
            const newLng = baseLng + Math.cos(angle) * (radius * 1.2);
            const heading = Math.round(((angle * 180) / Math.PI + 90) % 360);
            currentSpeed = Math.round(48 + Math.sin(angle * 2) * 16);
            sendLocation({
                latitude: newLat,
                longitude: newLng,
                speedKmh: currentSpeed,
                headingDeg: heading,
                batteryPercent: Math.max(20, Math.round(92 - angle)),
                altitude: 45,
            });
        }, 2500);
        toast.success('Convoy simulation mode started (55 km/h live telemetry loop)');
    }, [baseLat, baseLng, sendLocation, stopGpsBroadcast]);
    const stopSimulation = useCallback(() => {
        if (simTimerRef.current) {
            clearInterval(simTimerRef.current);
            simTimerRef.current = null;
        }
        setIsSimulating(false);
        setIsBroadcasting(false);
    }, []);
    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (geoWatchIdRef.current !== null) {
                navigator.geolocation.clearWatch(geoWatchIdRef.current);
            }
            if (simTimerRef.current) {
                clearInterval(simTimerRef.current);
            }
        };
    }, []);
    return {
        isConnected,
        riders,
        recentPings,
        isBroadcasting,
        isSimulating,
        sendLocation,
        sendCrewPing,
        startGpsBroadcast,
        stopGpsBroadcast,
        startSimulation,
        stopSimulation,
    };
}
//# sourceMappingURL=hooks.js.map