import {apiRequest} from './client';

export type AnnouncementKind = 'announcement' | 'offer';

export type Announcement = {
  id: string;
  kind: AnnouncementKind;
  title: string;
  body: string;
  recipients: number;
  createdAt: string;
};

export function fetchAnnouncements() {
  return apiRequest<{announcements: Announcement[]}>('/admin/announcements');
}

export function sendAnnouncement(payload: {
  kind: AnnouncementKind;
  title: string;
  body: string;
}) {
  return apiRequest<{announcement: Announcement}>('/admin/announcements', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
