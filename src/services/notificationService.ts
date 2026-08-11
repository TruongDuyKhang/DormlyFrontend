import { api } from "@/lib/axios";
import type { PageResponse } from "@/types/api";
import type {
  NotificationRequest,
  NotificationLog,
  ChannelType,
} from "@/types/models";

export interface SendNotificationResult {
  eventId: string;
  status: string;
}

export interface SendMultiNotificationResult {
  eventIds: string[];
  channels: ChannelType[];
  status: string;
}

export const notificationService = {
  /**
   * Send notification via single channel (Kafka async)
   */
  async send(payload: NotificationRequest): Promise<SendNotificationResult> {
    const { data } = await api.post<SendNotificationResult>(
      "/api/notifications",
      payload
    );
    return data;
  },

  /**
   * Send notification via multiple channels (Kafka async)
   */
  async sendMulti(
    payload: NotificationRequest,
    channels: ChannelType[]
  ): Promise<SendMultiNotificationResult> {
    const { data } = await api.post<SendMultiNotificationResult>(
      "/api/notifications/multi",
      payload,
      { params: { channels: channels.join(",") } }
    );
    return data;
  },

  /**
   * Query notification history logs
   */
  async getLogs(params?: {
    recipient?: string;
    channel?: ChannelType;
    status?: string;
    page?: number;
    size?: number;
  }): Promise<PageResponse<NotificationLog>> {
    const { data } = await api.get<PageResponse<NotificationLog>>(
      "/api/notifications/logs",
      { params }
    );
    return data;
  },

  /**
   * Check status of a single notification event
   */
  async getLog(eventId: string): Promise<NotificationLog> {
    const { data } = await api.get<NotificationLog>(
      `/api/notifications/logs/${eventId}`
    );
    return data;
  },
};
