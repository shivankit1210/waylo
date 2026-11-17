import apiClient from '@/lib/api';
import type {
  ApiResponse,
  RideSession,
  RiderLocation,
  CrewPingAlert,
  StartRideSessionInput,
  UpdateRiderLocationInput,
  SendCrewPingInput,
} from '@waylo/shared';

export const trackingApi = {
  /**
   * Get active ride session
   */
  async getSession(tripId: string): Promise<RideSession> {
    const res = await apiClient.get<ApiResponse<RideSession>>(
      `/trips/${tripId}/tracking/session`
    );
    return res.data.data;
  },

  /**
   * Start or resume ride session
   */
  async startSession(
    tripId: string,
    data: { name: string }
  ): Promise<RideSession> {
    const res = await apiClient.post<ApiResponse<RideSession>>(
      `/trips/${tripId}/tracking/session`,
      data
    );
    return res.data.data;
  },

  /**
   * End active ride session
   */
  async endSession(tripId: string): Promise<RideSession> {
    const res = await apiClient.patch<ApiResponse<RideSession>>(
      `/trips/${tripId}/tracking/session/end`
    );
    return res.data.data;
  },

  /**
   * Get snapshot of active riders in the trip
   */
  async getRiders(tripId: string): Promise<RiderLocation[]> {
    const res = await apiClient.get<ApiResponse<RiderLocation[]>>(
      `/trips/${tripId}/tracking/riders`
    );
    return res.data.data;
  },

  /**
   * Update current rider location via HTTP
   */
  async updateLocation(
    tripId: string,
    data: UpdateRiderLocationInput
  ): Promise<RiderLocation> {
    const res = await apiClient.post<ApiResponse<RiderLocation>>(
      `/trips/${tripId}/tracking/location`,
      data
    );
    return res.data.data;
  },

  /**
   * Get recent crew alerts & pings
   */
  async getPings(tripId: string): Promise<CrewPingAlert[]> {
    const res = await apiClient.get<ApiResponse<CrewPingAlert[]>>(
      `/trips/${tripId}/tracking/pings`
    );
    return res.data.data;
  },

  /**
   * Send crew alert / emergency beacon
   */
  async sendPing(
    tripId: string,
    data: Omit<SendCrewPingInput, 'tripId'>
  ): Promise<CrewPingAlert> {
    const res = await apiClient.post<ApiResponse<CrewPingAlert>>(
      `/trips/${tripId}/tracking/pings`,
      { ...data, tripId }
    );
    return res.data.data;
  },
};
