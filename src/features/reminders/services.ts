import { apiClient } from '@/shared/api/client';
import { ScreenPayload } from '@/shared/types';

export async function fetchRemindersData(): Promise<ScreenPayload> {
  const response = await apiClient.get<ScreenPayload>('/reminders');
  return response.data;
}

export async function scheduleReminder(time: string): Promise<void> {
  await apiClient.post('/reminders', { time });
}
